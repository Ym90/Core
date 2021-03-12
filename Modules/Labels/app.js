/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const fs = require("fs");
const { Labels } = require('./labels-info.js')

// Link to Storage
var dir = './../../Storage/Labels';

run = (core) => {

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    function write(text, file) {
        fs.writeFile(`${dir}/${file}.txt`, text, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    core.on('Twitch_Raid', c, () => {
        console.log(`${user} just subscribed to ${channel}`)
        write(user, 'Latest_Raid.txt')
    });
    core.on('Twitch_Host', c, () => {
        console.log(`${user} just subscribed to ${channel}`)
        write(user, 'Latest_Host.txt')
    });
    core.on('Twitch_Sub', c, () => {
        console.log(`${user} just subscribed to ${channel}`)
        write(user, 'Latest_Sub.txt')
    });

};

module.exports = {
    info: Labels.info,
    exec: run
};