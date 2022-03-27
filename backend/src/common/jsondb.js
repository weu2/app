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
        try {
            return JSON.parse(fs.readFileSync(this._filepath));
        } catch(e) {
            console.error(`${this._filepath} doesnt exist or the formatting is wrong`);
            return [];
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
}

module.exports = JSONDB;