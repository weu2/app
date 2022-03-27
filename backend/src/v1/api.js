const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    next();
});

// some weird code hallam added thats for the html
const os = require('os');
let ip;
const interfaces = os.networkInterfaces();
for (const i in interfaces) {
	ip = interfaces[i].find(interface => interface.family === 'IPv4' && !interface.internal);
	if (ip) break;
}

const user = require('./user');
router.use('/', user);

router.get('/ip', (req, res) => {
	res.send({ ip: ip?.address });
});

router.get('/test', (req, res) => {
    const jwt = require('../common/jwt');
	const test = {
		jwtverify:false
	};
	// verify jwt internally
	const tok = jwt.createJWT({
		iss: 'WeU Token Authoriser',
		sub: 'Steve or something idk',
		iat: 1234567890,
		jti: 1,
	})
	if(jwt.verifyJWT(tok)) test.jwtverify = true;

	res.send(test);
});

module.exports = router;