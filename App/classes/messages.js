/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class Message {
    constructor({
        platform = null,
        author = {
            username: null,
            displayname: null,
        },
        content = null,
        platformData = null,
        replyfunction = null,
    })
    {
        this.platform = platform;
        this.author = author;
        this.content = content;
        this.platformData = platformData;
        this.reply = replyfunction;
    }
}

module.exports = { Message }