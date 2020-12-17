const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require("./config.json");
const fs = require("fs");
const moment = require("moment")

function rng(min,max)	// random number generator
{
		return Math.floor(Math.random()*(max-min+1)+min);
}

client.on("ready", () => {
	
	console.log(`[LOGS] Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);


	function status() {	// random activity status game on reboot and after 30 minutes
		
		const FabrazGames = [
			"Cannon Crasha",
			"Planet Diver",
			"Slime-san",
			"Demon Turf"
		]
	
		try {
			client.user.setActivity(FabrazGames[rng(0, FabrazGames.length)], { type: 'PLAYING' });
		} catch(err) {
			console.log(`[ERR] Couldn't set Activity.`, err)
		}

	}

	setTimeout(status, 30 * 60 * 1000);
	status();

});


client.commands = new Discord.Collection();

fs.readdir("./cmd/", (err, files) => {		// scan cmd-folder for commands

	if(err) {
		console.log("[LOGS] Encountered an error:")
		console.log(err)
	}

	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if (jsfile.length <= 0) {
		return console.log("[LOGS] Unable to find commands.")
	}

	jsfile.forEach((f, i) => {

		let pull = require(`./cmd/${f}`)
		client.commands.set(pull.config.name, pull);
		if (pull.config.alias) {
			pull.config.alias.forEach(a => {
				client.commands.set(a, pull);
			})
		}

	});


});

/*client.on('guildMemberAdd', async member => {

});*/

client.on("message", async message => {

	const midgi = client.user;

	if (message.author.bot || message.author.id == midgi.id || !message.guild) return;	// return if the message author is a bot, midgi itself or if it was sent in a DM

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();


	// Commandhandler

	let commandfile = client.commands.get(command)

	if (commandfile) {
				
		if (commandfile.config.level == 1) {	// check if user has the Trello role

			if(!message.member.roles.cache.array().find(r => r.name.toLowerCase().includes("trello"))) return
			
			console.log(`[LOGS] Executed Trello command "m!${command}" by ${message.author.tag} (${message.author.id}) on ${moment((new Date()).getTime()).format("YYYY-MM-DD, HH:mm:ss")}.`)	
			
		}

		commandfile.run(client, message, args)

	}

});

process.on('unhandledRejection', error => {

	if (error.message == 'Missing Access') {

		console.log("[LOGS] MISSING ACCESS on " + error.path.slice(8,26))

	} else if (error.message == 'Missing Permission') {

		console.log("[LOGS] MISSING ACCESS on " + error.path.slice(8,26))

	} else console.log(error)

});


client.login(config.token);