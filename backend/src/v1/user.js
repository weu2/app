const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.use((req, res, next) => {
	next();
});

router.post('/login', (req, res) => {
	if (req.body.email && req.body.pwd) {
		auth.authenticate(req.body.email, req.body.pwd)
			.then(claim => res.send({ status: 'ok', claim: claim }))
			.catch(r => res.send({ status: r }));
	} else {
		res.send({ status: 'invalid api parameters' });
	}
})

router.get('/maketestlogin', (req, res) => {
	auth.makeFakeUser('test@example.com', 'test');
	res.send({ status: 'ok' });
});

router.post('/register', (req, res) => {
	if (req.body.email && req.body.pwd && req.body.iscustomer && req.body.firstname && req.body.lastname) {
		auth.createUser(req.body.email, req.body.pwd, req.body.iscustomer, req.body.firstname, req.body.lastname);
		res.send({ status: 'ok' });
	} else {
		res.send({ status: 'invalid api parameters' });
	}
});

module.exports = router;