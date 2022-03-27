const fs = require('fs');
// probably a terrible idea

class JSONDB {
    constructor(filepath) {
        //super();
        this._filepath = filepath;
        this._internal = this.initialLoad();
    }

    // sync load the json file
    initialLoad() {
        let filecontent = "";
        try {
            filecontent = fs.readFileSync(this._filepath);
        } catch(e) { 
            // if the file doesnt exist just make an empty array
            return []; 
        }
        try {
            return JSON.parse(filecontent);
        } catch(e) {
            console.error(`${this._filepath} has incorrect formatting!`);
            process.exit(1);
        }
    }

    asyncUpdate() {
        fs.writeFile(this._filepath, JSON.stringify(this._internal, null, '\t'), (err) => {
            if(err)
                console.error(`${this._filepath} doesnt exist`);
        });
    }

    find(key) {
        const keys = Object.keys(key);
        return this._internal.filter(e => {
            return keys.reduce((p, c) => {
                return p && e[c] === key[c];
            }, true);
        });
    }

    update(key, val) {
        const valkeys = Object.keys(val);
        this.find(key).forEach(e => {
            valkeys.forEach(k => {
                e[k] = val[k];
            });
        });
        this.asyncUpdate();
    }

    add(val) {
        this._internal.push(val)
        this.asyncUpdate();
    }
}

module.exports = JSONDB;