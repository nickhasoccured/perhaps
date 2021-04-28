/*
Copyright (C) 2021 Nicholas Christopher
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>
*/

const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client();

const cooldowns = new Discord.Collection();

const perhapsImage = new Discord.MessageAttachment("./perhaps.jpg");

const updatePresence = (c) => {
	c.user.setPresence({
		activity: {
			name: `${client.guilds.cache.size} servers!`,
			type: "WATCHING",
		},
	});
};

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag} (${client.user.id})`);

	updatePresence(client);
	setInterval(() => {
		updatePresence(client);
	}, 600000);
});

client.on("message", (message) => {
	if (
		message.author.bot ||
		!message.content ||
		!message.cleanContent.toLowerCase().includes("perhaps")
	) {
		return;
	}

	if (cooldowns.get(message.channel.id) + 1000 > Date.now()) return;

	message.channel
		.send(perhapsImage)
		.catch((error) => {
			console.error(
				`Failed to perhaps in #${message.channel.name} (${
					message.channel.id
				}) ${
					message.guild
						? `of server ${message.guild.name} (${message.guild.id})`
						: ""
				}
                ${error}`
			);
		})
		.then(() => {
			cooldowns.set(message.channel.id, Date.now());
		});
});

client.login(config.token);
