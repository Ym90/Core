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
       
        // Twitch Remaps
        chatClient.onAction(args => core.emit(`Twitch_Action`, args));
        chatClient.onAuthenticationFailure(args => core.emit(`Twitch_AuthenticationFailure`, args));
        chatClient.onBan(args => core.emit(`Twitch_Ban`, args));
        chatClient.onBitsBadgeUpgrade(args => core.emit(`Twitch_BitsBadgeUpgrade`, args));
        chatClient.onChatClear(args => core.emit(`Twitch_ChatClear`, args));
        chatClient.onCommunityPayForward(args => core.emit(`Twitch_CommunityPayForward`, args));
        chatClient.onCommunitySub(args => core.emit(`Twitch_CommunitySub`, args));
        chatClient.onEmoteOnly(args => core.emit(`Twitch_EmoteOnly`, args));
        chatClient.onFollowersOnly(args => core.emit(`Twitch_FollowersOnly`, args));
        chatClient.onGiftPaidUpgrade(args => core.emit(`Twitch_GiftPaidUpgrade`, args));
        chatClient.onHost(args => core.emit(`Twitch_Host`, args));
        chatClient.onHosted(args => core.emit(`Twitch_Hosted`, args));
        chatClient.onHostsRemaining(args => core.emit(`Twitch_HostsRemaining`, args));
        chatClient.onJoin(args => core.emit(`Twitch_Join`, args));
        chatClient.onMessage(args => {
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

            core.emit(`Twitch_Message`, args)
        });
        chatClient.onMessageFailed(args => core.emit(`Twitch_MessageFailed`, args));
        chatClient.onMessageRatelimit(args => core.emit(`Twitch_MessageRatelimit`, args));
        chatClient.onMessageRemove(args => core.emit(`Twitch_MessageRemove`, args));
        chatClient.onNoPermission(args => core.emit(`Twitch_NoPermission`, args));
        chatClient.onPart(args => core.emit(`Twitch_Part`, args));
        chatClient.onPrimeCommunityGift(args => core.emit(`Twitch_PrimeCommunityGift`, args));
        chatClient.onPrimePaidUpgrade(args => core.emit(`Twitch_PrimePaidUpgrade`, args));
        chatClient.onR9k(args => core.emit(`Twitch_R9k`, args));
        chatClient.onRaid(args => core.emit(`Twitch_Raid`, args));
        chatClient.onRaidCancel(args => core.emit(`Twitch_RaidCancel`, args));
        chatClient.onResub(args => core.emit(`Twitch_Resub`, args));
        chatClient.onRewardGift(args => core.emit(`Twitch_RewardGift`, args));
        chatClient.onRitual(args => core.emit(`Twitch_Ritual`, args));
        chatClient.onSlow(args => core.emit(`Twitch_Slow`, args));
        chatClient.onStandardPayForward(args => core.emit(`Twitch_StandardPayForward`, args));
        chatClient.onSub(args => core.emit(`Twitch_Sub`, args));
        chatClient.onSubExtend(args => core.emit(`Twitch_SubExtend`, args));
        chatClient.onSubGift(args => core.emit(`Twitch_SubGift`, args));
        chatClient.onSubsOnly(args => core.emit(`Twitch_SubsOnly`, args));
        chatClient.onTimeout(args => core.emit(`Twitch_Timeout`, args));
        chatClient.onUnhost(args => core.emit(`Twitch_Unhost`, args));
        chatClient.onWhisper(args => core.emit(`Twitch_Whisper`, args));

    }
    main();

    return Twitch.info;
}

module.exports = { info: Twitch.info, run }