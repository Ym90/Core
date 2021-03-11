/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class Service {
    constructor({
        ui = '',
        display = null,
        discription = null,
        settings = [],
    })
    {
        this.info = {ui, display, discription,settings}
    }
}

module.exports = { Service }