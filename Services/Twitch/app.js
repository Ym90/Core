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
        core.Twitch = chatClient;
        await chatClient.connect();
       
        // Twitch Remaps
        chatClient.onAction(args => core.emit(`Twitch_Action`, chatClient, args));
        chatClient.onAuthenticationFailure(args => core.emit(`Twitch_AuthenticationFailure`, chatClient, args));
        chatClient.onBan(args => core.emit(`Twitch_Ban`, chatClient, args));
        chatClient.onBitsBadgeUpgrade(args => core.emit(`Twitch_BitsBadgeUpgrade`, chatClient, args));
        chatClient.onChatClear(args => core.emit(`Twitch_ChatClear`, chatClient, args));
        chatClient.onCommunityPayForward(args => core.emit(`Twitch_CommunityPayForward`, chatClient, args));
        chatClient.onCommunitySub(args => core.emit(`Twitch_CommunitySub`, chatClient, args));
        chatClient.onEmoteOnly(args => core.emit(`Twitch_EmoteOnly`, chatClient, args));
        chatClient.onFollowersOnly(args => core.emit(`Twitch_FollowersOnly`, chatClient, args));
        chatClient.onGiftPaidUpgrade(args => core.emit(`Twitch_GiftPaidUpgrade`, chatClient, args));
        chatClient.onHost(args => core.emit(`Twitch_Host`, chatClient, args));
        chatClient.onHosted(args => core.emit(`Twitch_Hosted`, chatClient, args));
        chatClient.onHostsRemaining(args => core.emit(`Twitch_HostsRemaining`, chatClient, args));
        chatClient.onJoin(args => core.emit(`Twitch_Join`, chatClient, args));
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
            core.emit(`Twitch_Message`, chatClient, (channel, user, message, msg))
        });
        chatClient.onMessageFailed(args => core.emit(`Twitch_MessageFailed`, chatClient, args));
        chatClient.onMessageRatelimit(args => core.emit(`Twitch_MessageRatelimit`, chatClient, args));
        chatClient.onMessageRemove(args => core.emit(`Twitch_MessageRemove`, chatClient, args));
        chatClient.onNoPermission(args => core.emit(`Twitch_NoPermission`, chatClient, args));
        chatClient.onPart(args => core.emit(`Twitch_Part`, chatClient, args));
        chatClient.onPrimeCommunityGift(args => core.emit(`Twitch_PrimeCommunityGift`, chatClient, args));
        chatClient.onPrimePaidUpgrade(args => core.emit(`Twitch_PrimePaidUpgrade`, chatClient, args));
        chatClient.onR9k(args => core.emit(`Twitch_R9k`, chatClient, args));
        chatClient.onRaid(args => core.emit(`Twitch_Raid`, chatClient, args));
        chatClient.onRaidCancel(args => core.emit(`Twitch_RaidCancel`, chatClient, args));
        chatClient.onResub(args => core.emit(`Twitch_Resub`, chatClient, args));
        chatClient.onRewardGift(args => core.emit(`Twitch_RewardGift`, chatClient, args));
        chatClient.onRitual(args => core.emit(`Twitch_Ritual`, chatClient, args));
        chatClient.onSlow(args => core.emit(`Twitch_Slow`, chatClient, args));
        chatClient.onStandardPayForward(args => core.emit(`Twitch_StandardPayForward`, chatClient, args));
        chatClient.onSub(args => core.emit(`Twitch_Sub`, chatClient, args));
        chatClient.onSubExtend(args => core.emit(`Twitch_SubExtend`, chatClient, args));
        chatClient.onSubGift(args => core.emit(`Twitch_SubGift`, chatClient, args));
        chatClient.onSubsOnly(args => core.emit(`Twitch_SubsOnly`, chatClient, args));
        chatClient.onTimeout(args => core.emit(`Twitch_Timeout`, chatClient, args));
        chatClient.onUnhost(args => core.emit(`Twitch_Unhost`, chatClient, args));
        chatClient.onWhisper(args => core.emit(`Twitch_Whisper`, chatClient, args));

    }
    main();

    return Twitch.info;
}

module.exports = { info: Twitch.info, run};