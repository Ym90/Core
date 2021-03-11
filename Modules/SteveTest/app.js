/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Import Required classes
const { Module, Command } = require("./../../app/classes/submodule.js");

// Define Modules Details
let SteveTest = new Module ({
    author: {
        name: "IGSteven",
        photo: "https://avatars.githubusercontent.com/u/22038054?s=460&u=8f243ac4c9db719b46f90fef8ca9fb64dde266d2&v=4",
        link: "https://igsteven.com/"
    },
    name: "stevetest",
    services: [
        "Discord",
        "Twitch"
    ]
})

let commands = [

    new Command({name: "test",alias: ["cunt"], exec: async function (msg) {
        msg.reply("test works");
    }}),
]

let triggers = [

]

module.exports = {
    info: SteveTest.info,
    commands,
    triggers,
};