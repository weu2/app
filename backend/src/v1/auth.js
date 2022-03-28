// the auth file is for AUTHorisation and AUTHentication
const jwt = require('../common/jwt');
const JsonDB = require('../common/jsondb');
const bcrypt = require('bcrypt');


// these need to go in their own file for now they can live here
// and synced as they change
const jwtSecret = 'very good secret'; 
let jwtID = 0; 

function verifyClaim(claim) {
    
}

function makeFakeUser(username, password) {
    const users = new JsonDB('data/users.json');
    bcrypt.hash(password, 10).then(hash => { // idk 10 rounds of salt?
        users.add({
            id:username,
            pwdhash:hash
        });
    });
}

function createUser(username, password, iama, firstname, lastname) {
    const users = new JsonDB('data/users.json');
    bcrypt.hash(password, 10).then(hash => { // idk 10 rounds of salt?
        users.add({
            id:username,
            pwdhash:hash,
            iama: iama,
            firstname: firstname,
            lastname: lastname
        });
    });
}

function createClaim(username) {
    var iat = Math.floor(Date.now()/1000);
    var exp = iat + (60*60); // + 1 hour
    const payload = {
        sub: username,
		iat: iat,
        exp: exp,
		jti: jwtID
    };
    jwtID++;
    return jwt.createJWT(payload, jwtSecret);
}

function authenticate(username, password) {
    const users = new JsonDB('data/users.json');
    return new Promise((res, rej) => {    
        const user = users.find({id:username});
        if(user.length == 0) {
            rej("No users match"); 
            return;
        }
        bcrypt.compare(password, user[0].pwdhash, (err, result) => {
            if(err) {
                console.log(err);
                // cant really give a specific since thats a securuity flaw 
                rej("Authentication failed"); return;
            }
            if(result) {
                res(createClaim(username));
            } else {
                rej("Authentication failed");
            }
        });
    });
}

module.exports.verifyClaim = verifyClaim;
module.exports.authenticate = authenticate;
module.exports.makeFakeUser = makeFakeUser;
module.exports.createUser = createUser;