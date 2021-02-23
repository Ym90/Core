// Requirements
const EventEmitter = require('events');

// Core
class Ym90Core extends EventEmitter {
    constructor(op){
        this.param = Util.arrayOverwrite({}, op)

        // Database
        let db = new sqlite3.Database('./storage/database.sqlite', (err) => {
            if (err) {
            console.error(err.message);
            }
        });
    }
    
}

// Settings Handler
class Config {
    constructor (db){
        db.all(`SELECT * FROM settings`, [] ,(err, rows ) => {
            if (err) { throw err; }
            rows.forEach((row) => {  console.log(row.name)  });
        })
    }

    reload = function () {}
    get = function () {}
    set = function () {}
    clear = function () {}
    isTrue = function () {}
}

class Util {
    arrayOverwrite = function (a, b){
    // This is used to mainly as a way to swap out defaults.
        var c = a.concat(b)
        var d = c.filter((i,p) => c.indexof(i) == p)
        return d;
    }
}

// Exports
module.exports = core;
