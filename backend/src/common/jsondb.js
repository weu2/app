const fs = require('fs');
// probably a terrible idea

class JSONDB {
    constructor(filename) {
        //super();
        this._filename = filename;
        this._internal = [
            {name:"Finish The report 1", due:new Date(), notes:"Some Notes 11", concern:"csci314"},
            {name:"Finish The report 2", due:new Date(), notes:"Some Notes 12", concern:"csci314"},
            {name:"Finish The report 3", due:new Date(), notes:"Some Notes 13", concern:"csci314"},
            {name:"Finish The report 4", due:new Date(), notes:"Some Notes 14", concern:"csci314"},
            {name:"Finish The report 5", due:new Date(), notes:"Some Notes 15", concern:"csci314"},
            {name:"Finish The report 6", due:new Date(), notes:"Some Notes 16", concern:"csci314"},
            {name:"Finish The report 7", due:new Date(), notes:"Some Notes 17", concern:"csci314"},
            {name:"Finish The report 8", due:new Date(), notes:"Some Notes 18", concern:"csci314"},
            {name:"Finish The report 9", due:new Date(), notes:"Some Notes 19", concern:"csci314"},
            {name:"Finish The report 10", due:new Date(), notes:"Some Notes 11", concern:"csci314"},
            {name:"Finish The report 11", due:new Date(), notes:"Some Notes 12", concern:"csci314"},
            {name:"Finish The report 12", due:new Date(), notes:"Some Notes 13", concern:"csci314"},
            {name:"Finish The report 13", due:new Date(), notes:"Some Notes 14", concern:"csci314"},
            {name:"Finish The report 14", due:new Date(), notes:"Some Notes 15", concern:"csci314"},
            {name:"Finish The report 15", due:new Date(), notes:"Some Notes 16", concern:"csci314"},
            {name:"Finish The report 16", due:new Date(), notes:"Some Notes 17", concern:"csci314"},
            {name:"Finish The report 17", due:new Date(), notes:"Some Notes 18", concern:"csci314"},
            {name:"Finish The report 18", due:new Date(), notes:"Some Notes 191", concern:"csci314"},
            {name:"Finish The report 19", due:new Date(), notes:"Some Notes 12", concern:"csci314"},
            {name:"Finish The report 20", due:new Date(), notes:"Some Notes 13", concern:"csci314"},
            {name:"Finish The report 21", due:new Date(), notes:"Some Notes 14", concern:"csci314"},
            {name:"Finish The report 22", due:new Date(), notes:"Some Notes 15", concern:"csci314"}
        ];
    }

    // sync load the json file
    load() {
    }

    asyncUpdate() {
        fs.writeFile(this._filename, JSON.stringify(this._internal));
    }

    find(key) {
        const keys = Object.keys(key);
        return this._internal.filter(e => {
            const r = keys.reduce((p, c) => {
                p = e[c] === key[c];
                console.log(p);
            }, true);
            console.log(r);
            return r;
        })
    }

    update() {

    }
}

module.exports = JSONDB;