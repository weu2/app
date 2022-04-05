const express = require('express');
const router = express.Router();
const auth = require('./auth');
const JsonDB = require('../common/jsondb');

router.use((req, res, next) => {
	next();
});

router.post('/login', (req, res) => {
	if (req.body.email && req.body.pwd) {
		auth.authenticate(req.body.email, req.body.pwd)
			.then(claim => {
				res.cookie('claim', claim, { sameSite: 'Strict' }).send('OK');
			}).catch(err => {
				res.status(401).send('Unauthorized')
			});
	} else {
		res.status(400).send('Invalid API parameters');
	}
});

router.get('/maketestlogin', (req, res) => {
	auth.makeFakeUser('test@example.com', 'test');
	res.send('OK');
});

router.post('/register', (req, res) => {
	if (req.body.email && req.body.pwd && req.body.type && req.body.firstname && req.body.lastname) {
		auth.createUser(req.body.email, req.body.pwd, req.body.type, req.body.firstname, req.body.lastname);
		res.send('OK');
	} else {
		res.status(400).send('Invalid API parameters');
	}
});

router.get('/getinfo', (req, res) => {
	const id = auth.verifyClaim(req.cookies.claim);
	if (id) {
		const users = new JsonDB('data/users.json');
		const user = users.find({ id: id })[0];
		res.send({ type: user.type });
	} else {
		res.status(401).send('Unauthorized');
	}
});

module.exports = router;