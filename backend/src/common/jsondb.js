const fs = require('fs');
const path = require('path');
// probably a terrible idea

let dbCache = {};

function getFile(filepath) {
	if (!dbCache[filepath]) {
		try {
			const filecontent = fs.readFileSync(filepath); 
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

function updateFile(filepath) {
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

	getAll() {
		return this._internal;
	}

	// to find strings with matching values:
	// find({ status: {has: ["inprogress","accepted","finished"]})
	// to find where something does not equal:
	// find({ review: {not: null}})
	find(key) {
		const keys = Object.keys(key);
		return this._internal.filter(e => {
			return keys.reduce((p, c) => {
				if (key[c].has !== undefined) {
					return p && key[c].has.includes(e[c]);
				} else if (key[c].not !== undefined) {
					return p && e[c] !== key[c].not;
				} else {
					return p && e[c] === key[c];
				}
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
		const valKeys = Object.keys(val);
		this.find(key).forEach(e => {
			valKeys.forEach(k => {
				if (val[k] === null) {
					e[k] = null;
				} else {
					if (val[k].append !== undefined) {
						if (Array.isArray(e[k]) && Array.isArray(val[k].append)) {
							val[k].append.forEach(p => e[k].push(p));
						}
					} else if (val[k].new !== undefined) {
						e[k] = val[k].new;
					} else {
						e[k] = val[k];
					}
				}
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