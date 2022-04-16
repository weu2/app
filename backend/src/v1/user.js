const express = require('express');
const router = express.Router();
const auth = require('./auth');
const JsonDB = require('../common/jsondb');

router.use((req, res, next) => {
	next();
});

router.post('/login', (req, res) => {
	if (req.body.email && req.body.password) {
		auth.authenticate(req.body.email, req.body.password)
			.then(claim =>
				res.cookie('claim', claim, { sameSite: 'Strict' }).send('OK')
			).catch(err =>
				res.status(401).send(err)
			);
	} else {
		res.status(400).send('Missing API parameters');
	}
});

router.post('/register', (req, res) => {
	if (req.body.email && req.body.firstName && req.body.lastName && req.body.address && req.body.phoneNumber && req.body.license && req.body.password && req.body.type) {
		auth.createUser(req.body.email, 
			req.body.firstName, 
			req.body.lastName, 
			req.body.address, 
			req.body.phoneNumber, 
			req.body.license, 
			req.body.password, 
			req.body.type)
			.then(() =>
				res.status(200).send()
			).catch(err =>
				res.status(400).send(err)
			);
	} else {
		res.status(400).send('Missing API parameters');
	}
});

router.post('/update', (req, res) => {
	const uuid = auth.verifyClaim(req.cookies.claim);
	if (uuid) {
		const validUpdateKeys = ['email', 'firstName', 'lastName', 'address', 'phoneNumber', 'license'];
		const users = new JsonDB('data/users.json');

		const updateObject = {};

		Object.keys(req.body).forEach(key => {
			if(validUpdateKeys.includes(key))
			{
				updateObject[key] = req.body[key];
			}
		});

		users.update({uuid:uuid}, updateObject);

		res.status(200).send();
	} else {
		res.status(401).send();
	}
});

router.get('/getinfo', (req, res) => {
	const uuid = auth.verifyClaim(req.cookies.claim);
	if (uuid) {
		const users = new JsonDB('data/users.json');
		const user = users.find({ uuid: uuid })[0];
		// For security, send everything except the password hash
		delete user.passwordHash;
		// this is stored in the cookie so its not needed
		delete user.uuid;
		res.send(user);
	} else {
		res.status(401).send();
	}
});

module.exports = router;