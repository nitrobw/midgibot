const Discord = require("discord.js");
const config = require("../config.json");
var Trello = require("trello");
var trello = new Trello(config.trelloKey, config.trelloToken);

module.exports.run = async (client, message, args) => {

    let trelloData = {  // internal trello data, basically unused outside of troubleshooting
        list: "",
        title: "",
        desc: ""
    }
    
    let argParser = [...message.content.matchAll(/-.+?(?= -|$)/gi)]

    let cnt = {         // argument counters to check for duplicate arguments
        list: 0,
        title: 0,
        desc: 0
    }
    
    argParser.forEach(arg => {  // check if message contains arguments, increment counters and process content respectively

        arg = arg[0]

        switch(true) {
            case /-list /.test(arg):
                cnt.list++;
                trelloData.list = arg.slice(6)
                break
            case /-title /.test(arg):
                cnt.title++;
                trelloData.title = arg.slice(7)
                break
            case /-desc /.test(arg):
                cnt.desc++;
                trelloData.desc = arg.slice(6)
        }

    })

    // check if any of the counters does not equal 1, either the argument hasn't been specified or there are duplicates - either way, return an error
    if (cnt.list != 1 || cnt.title != 1 || cnt.desc != 1) {

        try {
            return message.channel.send("Hey, you might want to include a **list**, **title** *and* **description** for that **card**!\nPlease use the following formatting:\n`m!add -list LIST_NAME -title TITLE -desc DESCRIPTION`\n\nFor a list of **list**s, please type `m!list`")
        } catch(err) {
            console.log(`[ERR] Couldn't send message.`, err)
        }

    }

    let t_list;


    // check if (any close name variation of) an available list has been specified, return an error if not
    switch (true) {
        case /general( |_)*bugs/gi.test(trelloData.list):
            t_list = config.trelloListGeneral
            break
        case /gameplay( |_)*bugs/gi.test(trelloData.list):
            t_list = config.trelloListGameplay
            break
        case /menu( |_)*bugs/gi.test(trelloData.list):
            t_list = config.trelloListMenu
            break
        case /level( |_)*design( |_)*issue/gi.test(trelloData.list):
            t_list = config.trelloListLevel
            break
        case /general( |_)*suggestion/gi.test(trelloData.list):
            t_list = config.trelloListSuggestion
            break
        default:
            try {
                return message.channel.send("That is not a valid **list** option!\n\nFor a list of **list**s, please type `m!list`")
            } catch(err) {
                console.log(`[ERR] Couldn't send message.`, err)
            }
            
    }
   
    // console.log(trelloData.title, trelloData.desc, t_list)

    trello.addCard(trelloData.title, trelloData.desc, t_list,
        function (error, trelloCard) {
            if (error) {
                console.log("[LOGS] An error occured while adding a card.", error)
                console.log("[LOGS] Trello Carddata to be uploaded: ", trelloData)

                try {
                    message.channel.send("Oh, it seems like I wasn't able to process this **card** - Please contact the staff about this!");
                } catch(err) {
                    console.log(`[ERR] Couldn't send message.`, err)
                }
            }
            else {
                console.log("[LOGS] Trello Card has been successfully added - " + trelloCard.url)
                
                try {
                    message.channel.send("The **card** has been successfully added! Thanks for your support!");
                } catch(err) {
                    console.log(`[ERR] Couldn't send message.`, err)
                }
            }
        });

    return;

}

module.exports.config = {
	name: "add",
	desc: "Add a Card!",
	level: "1",
	usage: "m!add -list LIST_NAME -title TITLE -desc DESCRIPTION"
}