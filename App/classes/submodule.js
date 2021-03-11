/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

class Module {
    constructor({
        author = {
            name: null,
            photo: null,
            link: null
        },
        ui = null,
        description = null,
        services = [],
        settings = [],
    })
    {
        this.info = {ui, author, description, services, settings}
        this.settings = settings
    }
}

class Command {
    constructor({
        partof = null,
        name = null,
        prefix = null,
        alias = [],
        description = null,
        params = [],
        exec = async function () { return "Function not defined correctly!" }
    })

    {
        this.exec = exec;
        this.info = {partof, name, alias, description, params,}
    }
}

class Trigger {
    constructor({
        name = null,
        alias = [],
        description = null,
    })
    {
        this.info = {name, alias, description}
    }
}

module.exports = { Module, Command, Trigger }