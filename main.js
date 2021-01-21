const Discord = require("discord.js");

const config = require("./config.json");

const client = new Discord.Client();

const cooldowns = new Discord.Collection();

const perhapsImage = new Discord.MessageAttachment("./perhaps.jpg");

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
	client.user.setPresence({
		activity: {
			name: `${client.guilds.cache.size} servers!`,
			type: "WATCHING",
		},
	});

	setInterval(() => {
		client.user.setPresence({
			activity: {
				name: `${client.guilds.cache.size} servers!`,
				type: "WATCHING",
			},
		});
	}, 600000);
});

client.on("message", (message) => {
	if (
		message.author.bot ||
		!message.content ||
		!message.content.toLowerCase().includes("perhaps")
	)
		return;
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
