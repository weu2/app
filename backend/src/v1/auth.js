// the auth file is for AUTHorisation and AUTHentication
const jwt = require('../common/jwt');
const JsonDB = require('../common/jsondb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

// these need to go in their own file for now they can live here
// and synced as they change
const jwtSecret = 'very good secret'; 
let jwtID = 0; 

function verifyClaim(claim) {
	if (!claim) return;

	if (jwt.verifyJWT(claim, jwtSecret)) {
		const payload = jwt.extractPayload(claim);
		const time = Math.floor(Date.now() / 1000);
		
		const users = new JsonDB('data/users.json');
		if(users.find({uuid:payload.sub}).length !== 1)
			return;

		if (payload.exp < time) return;
		// check if the jwt id is valid somehow
		return payload.sub;
	}
}

/* User format currently:
{
	uuid: string
	email: string
	firstName: string
	lastName: string
	address: string
	phoneNumber: string
	license: string
	passwordHash: string
	userDetail: object
	CUSTOMER: object (optional)
	PROFESSIONAL: object (optional)
}
*/

function createUser(email, firstName, lastName, address, phoneNumber, license, password, type) {
	const userTypes = ["CUSTOMER", "PROFESSIONAL"];
	return new Promise((res, rej) => {
		const users = new JsonDB('data/users.json');

		// Check for same email registered twice
		if (users.find({ email: email }).length > 0) {
			return rej('Email already registered');
		}

		if (!userTypes.includes(type)) {
			return rej('Invalid user type');
		}

		bcrypt.hash(password, 10).then(hash => { // idk 10 rounds of salt?
			users.add({
				uuid: uuid.v4(),
				email: email,
				firstName: firstName,
				lastName: lastName,
				address: address,
				phoneNumber: phoneNumber,
				license: license,
				passwordHash: hash,
				userDetail: {},
				[type]: {}
			});
			res();
		});
	});
}

function createClaim(uuid) {
	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + 3600; // + 1 hour
	const payload = {
		sub: uuid,
		iat: iat,
		exp: exp,
		jti: jwtID
	};
	jwtID++;
	return jwt.createJWT(payload, jwtSecret);
}

function authenticate(email, password) {
	const users = new JsonDB('data/users.json');
	return new Promise((res, rej) => {    
		const user = users.find({ email: email })[0];
		if (!user) {
			rej('No matching users'); 
			return;
		}
		bcrypt.compare(password, user.passwordHash, (err, result) => {
			if (err) {
				console.log(err);
				// can't really give a specific reason since that's a security flaw 
				rej('Authentication failed');
			} else if (result) {
				res(createClaim(user.uuid));
			} else {
				rej('Authentication failed');
			}
		});
	});
}

module.exports.verifyClaim = verifyClaim;
module.exports.authenticate = authenticate;
module.exports.createUser = createUser;