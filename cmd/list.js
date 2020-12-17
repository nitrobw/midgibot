const Discord = require("discord.js");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {

    // trello lists as specified by Fabian in DMs
    
    try {
        message.channel.send("The available **list**s are ```General Bugs\nGameplay Bugs\nMenu Bugs\nLevel Design Issue\nGeneral Suggestion```")
    } catch(err) {
        console.log(`[ERR] Couldn't send message.`, err)
    }

    return;

}

module.exports.config = {
	name: "list",
	desc: "Lists Lists!",
	level: "1",
	usage: "m!list"
}