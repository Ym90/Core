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
        { key: "Bot_Token" } // Discord_Bot_Token
    ]
})

run = (core) => {

    let DiscordRemaps = [
        'channelCreate',
        'channelDelete',
        'channelPinsUpdate',
        'channelUpdate',
        'debug',
        'emojiCreate',
        'emojiDelete',
        'error',
        'guildBanAdd',
        'guildBanRemove',
        'guildCreate',
        'guildDelete',
        'guildIntegrationUpdate',
        'guildMemberAdd',
        'guildMemberAvailable',
        'guildMemberRemove',
        'guildMembersChunk',
        'guildMemberSpeaking',
        'guildMemberUpdate',
        'guildUnavailable',
        'guildUpdate',
        'invalidated',
        'inviteCreate',
        'inviteDelete',
        'message',
        'messageDelete',
        'messageDeleteBulk',
        'messageReactionAdd',
        'messageReactionRemove',
        'messageReactionRemoveAll',
        'messageReactionRemoveEmoji',
        'messageUpdate',
        'presenceUpdate',
        'ratelimit',
        'ready',
        'roleCreate',
        'roleDelete',
        'roleUpdate',
        'shardDisconnect',
        'shardError',
        'shardReady',
        'shardReconnecting',
        'shardResume',
        'typingStart',
        'userUpdate',
        'voiceStateUpdate',
        'warn',
        'webhookUpdate'
    ].forEach(Event => {
        client.on(Event, async args => {
            core.emit(`Discord_${Event}`, args)
        });
    });

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
    });

    client.login(core.get('Discord_Bot_Token'))
    return Discord.info;
}

module.exports = { info: Discord.info, run}