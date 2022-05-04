const fs = require('fs');
const path = require('path');
// probably a terrible idea

let dbCache = {};

function getFile(filepath)
{
    if(!dbCache[filepath]) {
        let filecontent;
        try {
            filecontent = fs.readFileSync(filepath); 
            try {
                dbCache[filepath] = JSON.parse(filecontent);
            } catch(e) {
                console.error(`${filepath} has incorrect formatting!`);
                process.exit(1);
            }
        } catch(e) {
            // make the folder just in case
            fs.mkdir(path.dirname(filepath), { recursive: true }, (err) => {
                if (err) throw err; // not sure why this would happen, no perms maybe unix moment
            });
            // if the file doesnt exist just make an empty array
            dbCache[filepath] = [];
        }
    }
    return dbCache[filepath];
}

function updateFile(filepath)
{
    fs.writeFile(filepath, JSON.stringify(dbCache[filepath], null, '\t'), (err) => {
        if (err) {
            console.error(`path ${filepath}, doesnt exist!`);
        }
    });
}

class JSONDB {
    constructor(filepath) {
        //super();
        this._filepath = filepath;
        this._internal = getFile(filepath);
    }

    asyncUpdate() {
        updateFile(this._filepath);
    }

    find(key) {
        const keys = Object.keys(key);
        return this._internal.filter(e => {
            return keys.reduce((p, c) => {
                if(key[c].has)
                    return p && key[c].has.includes(e[c]);
                else 
                    return p && e[c] === key[c];
            }, true);
        });
    }

    hasKeys(keys) {
        return this._internal.filter(e => {
            return keys.reduce((p, c) => p && e[c] !== undefined, true);
        });
    }
    
    // to update arrays you have two options, new or append
    // update(keyValues, {array: {append : ['another value', 'another one']}});
    // update(keyValues, {array: {new : ['new array', 'thats right']}});
    update(key, val) {
        const valkeys = Object.keys(val);
        this.find(key).forEach(e => {
            valkeys.forEach(k => {
                if(val[k].append){
                    if(Array.isArray(e[k]) && Array.isArray(val[k].append))
                        val[k].append.forEach(p => e[k].push(p));
                } else if (val[k].new) {
                    e[k] = val[k].new;
                } else 
                    e[k] = val[k];
            } );
        });
        this.asyncUpdate();
    }

    add(val) {
        this._internal.push(val)
        this.asyncUpdate();
    }
}

module.exports = JSONDB;