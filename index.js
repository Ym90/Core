/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Strict Mode
'use strict';

function cl(p) {
    console.log(`${new Date().toGMTString()} | ${p}`)
}

cl(`Loading | YM90 by IGSteven is now Starting...`)

// Requirements
cl(`Loading | Loading all Requirements.`)
const YM90 = require('./app/app.js')
const core = new YM90({});


core.on('ready', msg => {
    // loading overwrites
    require('./App/overwrites.js').run(core);

    let prefix = core.get('Core_Prefix');
    cl(`INFO | ============================================ `)
    cl(`INFO | YM90 Bot By @IGSteven & Co`)
    cl(`INFO | Command Prefix: \'${prefix}\'`)
    cl(`INFO |`)
    cl(`INFO | Services: ${core.ActiveServices.size}`)
    cl(`INFO | Modules: ${core.ActiveModules.size}`)
    cl(`INMO | Commands: ${core.CommandList.size}`)
    cl(`INFO | ============================================ `)
});


core.on('message', msg => {
    let prefix = core.Settings.get('Core_Prefix').info.value;

    let content = `${msg.content}`.toLocaleLowerCase();
    let command = content.slice(prefix.length);
    let args = command.split(' ');

    // Check if Command or Alias Exists
    if (core.CommandList.has(args[0])) {

        // Get the Command and its related Module Data
        let CommandData = core.CommandData.get(core.CommandList.get(args[0]))
        let ModuleData = core.ActiveModules.get(CommandData.info.partof);
        console.log(ModuleData)
        console.log(msg)
        // Check if the Module Supports the Platform the Message comes from.
        if (ModuleData.info.services.includes(msg.platform)) {
            CommandData.exec(msg, args);
        }
    }
})