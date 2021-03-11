/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class Setting {
    constructor({
        key = null,
        value = null,
        dfault = null
    }) {
        this.info = { key, value, dfault }
        this.key = key
        this.value = value;
    }
}

module.exports = { Setting }