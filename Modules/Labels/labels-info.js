/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Import Required classes
const { Module } = require("./../../App/classes/submodule.js");

// Define Modules Details
let Labels = new Module ({
    author: {
        name: "IGSteven",
        photo: "https://avatars.githubusercontent.com/u/22038054?s=460&u=8f243ac4c9db719b46f90fef8ca9fb64dde266d2&v=4",
        link: "https://igsteven.com/"
    },
    description: "Text Labels to add into OBS",
    services: [
        "twitch"
    ]
})

module.exports = { Labels }