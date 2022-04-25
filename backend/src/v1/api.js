const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    next();
});

// some weird code hallam added
// gets a publically accessible IP for the server (maybe)
const os = require('os');
let ip;
const interfaces = os.networkInterfaces();
for (const i in interfaces) {
	ip = interfaces[i].find(info => info.family === 'IPv4' && !info.internal);
	if (ip) break;
}

router.use('/user', require('./user'));
router.use('/callout', require('./callout'));
router.use('/image', require('./image'));

router.get('/ip', (req, res) => {
	if (ip && ip.address) {
		res.send({ ip: ip.address });
	} else {
		res.status(503).send('No IP available');
	}
});

router.get('/test', (req, res) => {
    const jwt = require('../common/jwt');
	const test = {
		jwtverify: false
	};
	// verify jwt internally
	const secret = 'calebwashere';
	const tok = jwt.createJWT({
		iss: 'WeU Token Authoriser',
		sub: 'Steve or something idk',
		iat: 1234567890,
		jti: 1,
	}, secret)
	if (jwt.verifyJWT(tok, secret)) test.jwtverify = true;

	res.send(test);
});

module.exports = router;