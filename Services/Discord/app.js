/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Requirements
const DiscordJS = require('discord.js');
const client = new DiscordJS.Client({autoReconnect:true});

const { Service } = require("./../../app/classes/service.js");
const { Message } = require("./../../app/classes/messages.js");

const Discord = new Service ({
    display: "Discord",
    discription: "Chatbot for DiscordJS Service",
    settings: [
        {
            key: "Bot_Token", // Stored in datbase as Discord_Bot_Token
            value: "",
        }
    ]
})

run = (core) => {

    client.on('message', msg => {
        if (msg.author.bot || msg.channel.type == 'dm') return;

        let YM90Message = new Message({
            platform: Discord.info.display,
            platformData: msg,
            author: {
                username: msg.author.tag,
                display: msg.author.tag,           
            },
            content: msg.content,
            replyfunction: function (reply) { msg.reply(reply) }
        })

        core.emit('message', YM90Message);
        core.emit('Discord_Message', msg);
    });
    console.log(core.get('Discord_Bot_Token'));
    client.login(core.get('Discord_Bot_Token'))
    return Discord.info;
}

module.exports = { info: Discord.info, run}