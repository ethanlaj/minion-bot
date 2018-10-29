var Discord = require("discord.js");
module.exports = {
	run: async function (bot, message, args) {
		if (message.member.highestRole.position < message.guild.roles.get("437767667047333889").position) return message.reply("You do not have permission to use this command!");
		if (this.settings.running) return message.reply("This bot is already dming all members of this server, please try again later.");
		if (!args[0]) return message.reply(`You did not supply enough parameters. Usage: \`${this.settings.usage}\``);
		var members = message.guild.members.array().filter((m) => !m.user.bot);
		var announceEmbed = new Discord.RichEmbed()
			.setColor("RED")
			.setTitle("Event Notifier")
			.setDescription(args.join(" "));
		var i = 0;
		await message.reply("\nYou are about to send a message that looks like the one below to ALL members\nType **CONFIRM** to confirm.\nType anything else to cancel.\nOnce started, this cannot be stopped.", {embed: announceEmbed});
		message.channel.awaitMessages((m) => m.author.id === message.author.id, { maxMatches: 1, time: 15000, errors: ["time"] }).then((collected) => {
			if (collected.first().content !== "CONFIRM") return message.reply("Cancelled prompt.");
			this.settings.running = true;
			message.reply("Okay, I started dming all members of this server.");
			async function dmMember() {
				if (i <= members.length - 1) {
					await members[i].send(announceEmbed).catch(() => {});
					i++;
					setTimeout(dmMember, 10000);
				} else {
					module.exports.settings.running = false;
				}
			}
			setTimeout(dmMember, 1000);
		}).catch(() => {
			message.channel.send("Prompt was cancelled because there was no response for 15 seconds.");
		});
	},
	settings: {
		name: "dmall",
		usage: "!dmall (dm)",
		requiredRole: "",
		running: false
	}
};
