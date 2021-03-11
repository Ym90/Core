/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
                                                                                   
                   YM90 Core | Module Bot for multiple platforms                   
                         Github: @Ym90/Core | Version 0.1                          
                                                                                   
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Core
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const EventEmitter = require('events');
const { Setting } = require('./classes/setting.js');

class Core extends EventEmitter {
    constructor({

    }) {
        super() // Load EventEmitter
        this.cl(`Loading | Core is now loaded.`)

        this.Settings = new Map(); // List of Settings

        this.ActiveServices = new Map(); // List of Active Services
        this.ActiveModules = new Map(); // List of Active Modules

        this.CommandData = new Map(); // Active Commands
        this.CommandList = new Map(); // List of Commands and Aliases

        this.TriggerList = new Map();

        this.cl(`Loading | Connecting to sqlite3 database`)
        this.db = new sqlite3.Database('./storage/database.sqlite3', (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        this.cl(`Loading | Settings now loading from database`)
        this.db.all(`SELECT * FROM settings`, [], (err, rows) => {
            if (err) { throw err; }
            rows.forEach((row) => {
                this.set(row.Key, row.Value);
            });


            // Load Services
            this.getEnabledServices().forEach(Service => {
                this.LoadService(Service.ui, Service);
            });

            this.getEnabledModules().forEach(Module => {
                this.LoadModule(Module.ui, Module);
            });

            this.emit('ready');
        });


        setInterval(() => {
            this.SaveConfig()
        }, 300000)

    }

    //
    // FUNCTIONS
    //

    getServiceInfo = function (ServiceName){
        let Servicedata = require(`./../Services/${ServiceName}/app.js`).info;
        Servicedata.ui = ServiceName
        return Servicedata;
    }
    getModuleInfo = function (ModuleName){
        let Moduledata = require(`./../Modules/${ModuleName}/app.js`).info;
        Moduledata.ui = ModuleName;
        return Moduledata;
    }

    getInstalledServices = function () {
        let list = [];
        this.getDirectories('./Services').forEach(ServiceName => {
            list.push(this.getServiceInfo(ServiceName));
        });
        return list;
    }

    getInstalledModules = function () {
        let list = [];
        this.getDirectories('./Modules').forEach(ModuleName => {
            list.push(this.getModuleInfo(ModuleName));
        });
        return list;
    }

    getEnabledServices = function () {
        let installed = this.getInstalledServices();
        let list = []

        installed.forEach(ServiceData => {
            let SettingKey = `${ServiceData.ui}_active`;

            if (this.has(SettingKey)) {
                if (this.get(SettingKey) == 'true') {
                    list.push(ServiceData);
                }
            } else {
                this.set(SettingKey, false, false)
            }
        });
        return list;
    }

    getEnabledModules = function () {
        let installed = this.getInstalledModules();
        let list = []


        installed.forEach(ModuleData => {
            let SettingKey = `${ModuleData.ui}_active`;
            
            if (this.has(SettingKey)) {
                if (this.get(SettingKey) == 'true') {
                    list.push(ModuleData);
                }
            } else {
                this.set(SettingKey, false, false)
            }
        });
        return list;
    }

    LoadService = function (ServiceName, ServiceData){
        // Check if the Service is already active (prevent dublicates)
        let AlreadyHas = this.ActiveServices.has(ServiceName)
        if (AlreadyHas) return new Error(`LoadService was run but Service already loaded ${ServiceName}`);
        if (!ServiceData) { let ServiceData = this.getModuleInfo(ServiceName);}
    
        let Service = require(`./../Services/${ServiceName}/app.js`);

        // Load the Execuatable from the Service.
        this.ActiveServices.set(ServiceName, Service)

        // Load Settings
        if (ServiceData.settings) {
            ServiceData.settings.forEach(set => {
                let SettingName = `${ServiceName}_${set.key}`;

                if (!this.Settings.has(SettingName)) {
                    this.Settings.set(SettingName, new Setting({key: SettingName, value: set.value}));
                }
            })
        }

        // Load Executable if exists
        if (Service.run) {
            Service.run(this);
        }
    }

    LoadModule = function (ModuleName, ModuleData){ 
        // Check if the Service is already active (prevent dublicates)
        let AlreadyHas = this.ActiveModules.has(ModuleName)
        if (AlreadyHas) return new Error(`LoadModule was run but Module already loaded ${ModuleName}`);
        if (!ModuleData) { let ModuleData = this.getModuleInfo(ModuleName); }

        // Load the app.js file
        let Module = require(`./../Modules/${ModuleName}/app.js`);
        this.ActiveModules.set(ModuleName, Module);

        // Load Module Settings
        if (ModuleData.settings) {
            ModuleData.settings.forEach(set => {
                let SettingName = `${ModuleName}_${set.key}`;

                if (!this.Settings.has(SettingName)) {
                    this.Settings.set(SettingName, new Setting({key: SettingName, value: set.value}));
                }
            })
        }

        // Load Commands
        if (Module.commands) {
            Module.commands.forEach(Command => {
                Command.info.partof = ModuleName;
                let name = `${ModuleName}_${Command.info.name}`;
                // Add Command to command list.
                this.CommandList.set(Command.info.name, name);
                // Add Aliases to the Command List. 
                Command.info.alias.forEach(Alias => {this.CommandList.set(Alias, name)})
                this.CommandData.set(name, Command)
            })
        }

        // Load Module Trigger
         // TO BE ADDED IN FUTURE VERSION

        // Load Executable if exists
        if (Module.run) {
            Module.run(this);
        }
    }

    getDirectories = function (path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }

    SaveConfig = function () {
        let sqlqueries = '';
        this.Settings.forEach((s) => {
            sqlqueries = sqlqueries + `REPLACE INTO "settings" ("Key", "Value") VALUES ('${s.key}', '${s.value}');\n`;
        })
        this.db.get(sqlqueries, [], (err) => { if (err) cl(err) });
        this.cl(`Settings | configuration has been saved.`)
    }

    cl = function (msg) {
        console.log(`${new Date().toGMTString()} | ${msg}`)
    }

    get = function (key) {
        return this.Settings.get(key).value;
    }
    set = function (nkey, nvalue, ndfault) {
        return this.Settings.set(nkey, new Setting({
            key: nkey,
            value: nvalue,
            dfault: ndfault
        }));
    }
    update = function (key, value) {
        // Load the orignal
        let o = this.Settings.get(key);
        // Overwrite the value with new value
        o.value = value
        // Update map with new Setting object
        this.cl(`Settings | ${key} has been updated with value \'${value}\'`)
        return this.Settings.set(key, o);
    }
    has = function (key) {
        let e = this.Settings.has(key)
        if (e) return true;
        else return false;
    }
}

module.exports = Core;