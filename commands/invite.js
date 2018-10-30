module.exports = {
	run: (bot, message) => {
		bot.generateInvite(["ADMINISTRATOR"]).then((invite) => {
			message.reply(invite);
		});
	},
	settings: {
		name: "invite",
		usage: "!invite"
	}
};
