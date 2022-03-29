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
				res.cookie('claim', claim, {sameSite:'Strict'}).send({ status: 'ok' });
			}).catch(r => res.send({ status: r }));
	} else {
		res.send({ status: 'invalid api parameters' });
	}
});

router.get('/maketestlogin', (req, res) => {
	auth.makeFakeUser('test@example.com', 'test');
	res.send({ status: 'ok' });
});

router.post('/register', (req, res) => {
	if (req.body.email && req.body.pwd && req.body.category && req.body.firstname && req.body.lastname) {
		auth.createUser(req.body.email, req.body.pwd, req.body.category, req.body.firstname, req.body.lastname);
		res.send({ status: 'ok' });
	} else {
		res.send({ status: 'invalid api parameters' });
	}
});

router.post('/getinfo', (req, res) => {
	const id = auth.verifyClaim(req.cookies.claim);
	if(id) {
		const users = new JsonDB('data/users.json');
		const user = users.find({id:id})[0];
		res.send({category:user.category});
	} else {
		res.status(401);
		res.send();
	}
});

module.exports = router;