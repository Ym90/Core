/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const fs = require("fs");
const { nModule } = require('./info.js')

run = (core) => {

    core.on('message', msg => {
        const Discord_Channel_ID = core.get('ChatHook_Discord_Channel');
        const Dchannel = core.Discord.channels.cache.get(Discord_Channel_ID);

        const Twitch_Channel = core.get('ChatHook_Discord_Channel');
        // Ignore Messages in wrong channel
        if (msg.platform == 'Discord'){
            if (!msg.platformData.channel.id == Discord_Channel_ID) return;
        }

        if (msg.platform == 'Twitch'){
            if (!msg.platformData.channel == Twitch_Channel) return;
        }

        let NewMessage = `[${msg.platform}/${msg.author.username}] ${msg.content}`;
        console.log(NewMessage);

        if (msg.platform !== 'Twitch') { core.Twitch.say('IGSteven', NewMessage)}
        if (msg.platform !== 'Discord') { Dchannel.send(NewMessage) }
    
    });

};

module.exports = {
    info: nModule.info,
    run
};