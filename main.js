/*
Copyright (C) 2021 Nicholas Christopher

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { Client, Collection, MessageAttachment } = require("discord.js");
const { token } = require("./config.json");

const client = new Client();
const cooldowns = new Collection();
const perhapsImage = new MessageAttachment("./perhaps.jpg");

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag} (${client.user.id})`);

	const update = () => {
		client.user.setPresence({
			activity: {
				name: `${client.guilds.cache.size} servers!`,
				type: "WATCHING",
			},
		});
	};

	update();
	setInterval(update, 600000);
});

client.on("message", ({ author, cleanContent, channel, guild }) => {
	if (
		author.bot ||
		!cleanContent?.toLowerCase().includes("perhaps")) return;

	if (cooldowns.get(channel.id) + 1000 > Date.now()) return;

	channel
		.send(perhapsImage)
		.catch((error) => {
			console.error(
				`Failed to perhaps in #${channel.name} (${
					channel.id
				}) ${
					guild
						? `of server ${guild.name} (${guild.id})`
						: ""
				}
                ${error}`
			);
		})
		.then(() => {
			cooldowns.set(channel.id, Date.now());
		});
});

process.on("SIGINT", () => {
	client.destroy();
	console.log("Destroyed client");
	process.exit(0);
});

client.login(token);
