/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


const { Service } = require("./../../app/classes/service.js");
const { Message } = require("./../../app/classes/messages.js");

const Twitch = new Service({
    display: "Twitch",
    discription: "Chat Bot Module for Twitch TV",
    settings: [
        { key: "Client_ID" }, // Twitch_Client_ID
        { key: "Client_Secret"}, // Twitch_Client_Secret
        { key: "Access_Token"}, // Twitch_Access_Token
        { key: "Refresh_Token"}, // Twitch_Refresh_Toklen
        { key: "Token_Expire", Value: 0},
        { key: "Channel", dfault: ['IGSteven']} // Twitch_Channels // Has to be a valid channel as default or errors out
    ]
})

const { RefreshableAuthProvider, StaticAuthProvider } = require('twitch-auth');
const { ChatClient } = require('twitch-chat-client');

run = (core) => {
    async function main() {
    let clientId = core.get('Twitch_Client_ID'),
        clientSecret = core.get('Twitch_Client_Secret'),
        accessToken = core.get('Twitch_Access_Token'),
        refreshToken = core.get('Twitch_Refresh_Token'),
        expiryTimestamp = core.get('Twitch_Token_Expire'),
        channel = JSON.parse(core.get('Twitch_Channel'));
        
        const auth = new RefreshableAuthProvider(
            new StaticAuthProvider(clientId, accessToken),
            {
                clientSecret,
                refreshToken: refreshToken,
                expiry: expiryTimestamp === null ? null : new Date(expiryTimestamp),
                onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
                    core.update('Twitch_Access_Token', accessToken);
                    core.update('Twitch_Refresh_Token', refreshToken);
                    let expiryTimestamp = expiryDate === null ? null : expiryDate.getTime();
                    core.update('Twitch_Token_Expire', expiryTimestamp);

                    accessToken = accessToken;
                    refreshToken = refreshToken;
                }
            }
        );
  
        const chatClient = new ChatClient(auth, { channels: channel });
        await chatClient.connect();

        chatClient.onMessage((channel, user, message, msg) => {
            let YM90Message = new Message({
                platform: Twitch.info.display,
                platformData: msg,
                author: {
                    username: user,
                    display: user,
                },
                content: message,
                replyfunction: function (reply) { chatClient.say(channel, `\^${reply}`) }
            })
            core.emit('message', YM90Message);
            core.emit('Twitch_Message', (channel, user, message));
        });
    }
    main();

    return Twitch.info;
}

module.exports = { info: Twitch.info, run }