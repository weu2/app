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
			.then(claim => {
				res.cookie('claim', claim, { sameSite: 'Strict' }).send('OK');
			}).catch(err => {
				res.status(401).send('Unauthorized')
			});
	} else {
		res.status(400).send('Missing API parameters');
	}
});

router.get('/maketestlogin', (req, res) => {
	auth.makeFakeUser('test@example.com', 'test');
	res.send('OK');
});

const userTypes = ["CUSTOMER", "PROFESSIONAL"];

router.post('/register', (req, res) => {
	if (req.body.email && req.body.firstName && req.body.lastName && req.body.address && req.body.phoneNumber && req.body.license && req.body.password && req.body.type) {
		if (userTypes.includes(req.body.type)) {
			auth.createUser(req.body.email, 
				req.body.firstName, 
				req.body.lastName, 
				req.body.address, 
				req.body.phoneNumber, 
				req.body.license, 
				req.body.password, 
				req.body.type)
				.then(() => res.status(200).send() )
				.catch(() => res.status(400).send('Information already registered') );
		} else {
			res.status(400).send('Invalid user type');
		}
	} else {
		res.status(400).send('Missing API parameters');
	}
});

router.get('/getinfo', (req, res) => {
	const email = auth.verifyClaim(req.cookies.claim);
	if (email) {
		const users = new JsonDB('data/users.json');
		const user = users.find({ email: email })[0];
		// For security, send everything except the password hash
		delete user.passwordHash;
		res.send(user);
	} else {
		res.status(401).send('Unauthorized');
	}
});

module.exports = router;