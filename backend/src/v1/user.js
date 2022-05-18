const express = require('express');
const multer = require('multer');

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');

const router = express.Router();
const upload = multer();

router.use((req, res, next) => {
	next();
});

router.post('/login', upload.none(), (req, res) => {
	
	if(!apiValidator.validate(req, {
		email: {type:"string", required:true},
		password: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	auth.authenticate(req.body.email, req.body.password)
		.then(claim =>
			res.cookie('claim', claim, { sameSite: 'Strict' }).send()
		).catch(err =>
			res.status(401).send(err)
		);
});

router.post('/register', upload.none(), (req, res) => {

	const isLocationRequired = req.body.type === "PROFESSIONAL";

	if(!apiValidator.validate(req, {
		email: {type:"string", required:true},
		firstName: {type:"string", required:true},
		lastName: {type:"string", required:true},
		address: {type:"string", required:true},
		phoneNumber: {type:"string", required:true},
		license: {type:"numberString", required:true},
		password: {type:"string", required:true},
		type: {type:"string", required:true},
		locationLat: {type:"numberString", required:isLocationRequired},
		locationLong: {type:"numberString", required:isLocationRequired}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	auth.createUser(req.body.email, 
		req.body.firstName, 
		req.body.lastName, 
		req.body.address, 
		req.body.phoneNumber, 
		req.body.license, 
		req.body.password, 
		req.body.type,
		isLocationRequired ? 
		{
			locationLat: req.body.locationLat,
			locationLong: req.body.locationLong
		} :
		{} 
	).then(() =>
		res.status(200).send()
	).catch(err =>
		res.status(400).send(err)
	);
});

router.post('/update', upload.none(), (req, res) => {
	const uuid = auth.verifyClaim(req.cookies.claim);
	if (uuid) {
		const validUpdateKeys = ['email', 'firstName', 'lastName', 'address', 'phoneNumber', 'license', 'pushNotif'];
		const users = new JsonDB('data/users.json');

		const updateObject = {};
		Object.keys(req.body).forEach(key => {
			if (validUpdateKeys.includes(key)) {
				// convert pushNotif from string to boolean, ideally wouldn't be required
				if (key === 'pushNotif') {
					req.body[key] = req.body[key] === "true" ? {} : null;
				}
				updateObject[key] = req.body[key];
			}
		});

		users.update({ uuid: uuid }, updateObject);

		res.status(200).send();
	} else {
		res.status(401).send();
	}
});

// For live location tracking, remove if not desired
router.post('/track', upload.none(), (req, res) => {

	if(!apiValidator.validate(req, {
		locationLat: {type:"numberString", required:true},
		locationLong: {type:"numberString", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const uuid = auth.verifyClaim(req.cookies.claim);
	if (uuid) {
		const users = new JsonDB('data/users.json');
		const user = users.find({ uuid: uuid })[0];
		if (!user) {
			res.status(400).send();
			return;
		}
		// don't error since this URL gets spammed on all user types
		if (user.PROFESSIONAL) {
			user.PROFESSIONAL.locationLat = req.body.locationLat;
			user.PROFESSIONAL.locationLong = req.body.locationLong;
			users.asyncUpdate();
		}
		res.status(200).send();
	} else {
		res.status(401).send();
	}
});

function getType(user) {
	if (user.CUSTOMER) return "CUSTOMER";
	if (user.PROFESSIONAL) return "PROFESSIONAL";
	if (user.ADMINISTRATOR) return "ADMINISTRATOR";
	return null;
}

router.get('/getInfo', (req, res) => {
	const uuid = auth.verifyClaim(req.cookies.claim);
	if (uuid) {
		const users = new JsonDB('data/users.json');
		const user = Object.assign({}, users.find({ uuid: uuid })[0]);
		if (!user) {
			res.status(400).send();
			return;
		}
		// For security, send everything except the password hash
		delete user.passwordHash;
		// this is stored in the cookie so its not needed
		delete user.uuid;
		// add user type for ease of use
		user.type = getType(user);
		res.send(user);
	} else {
		res.status(401).send();
	}
});

module.exports = router;