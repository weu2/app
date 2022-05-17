const express = require('express');
const router = express.Router();

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const PayPal = require('../common/paypal');

router.use((req, res, next) => {
	// first we validate the user
	const userUuid = auth.verifyClaim(req.cookies.claim);
	if (userUuid) {
		req.userUuid = userUuid;
		next();
	} else {
		res.status(401).send();
	}
});

// /api/v1/membership/create
router.post("/create", (req, res) => {
	PayPal.createSubscription().then(data => {
		res.status(200).send(data);
	}).catch(() => {
		res.status(400).send();
	});
});

router.post("/capture", (req, res) => {
	
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: req.userUuid })[0];
	// ensure user details are valid
	if (!user || !user.CUSTOMER) {
		res.status(400).send();
		return;
	}

	user.CUSTOMER.subscription = req.body.subscriptionID;
	users.asyncUpdate();

	res.status(200).send();
});

router.post("/cancel", (req, res) => {

	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: req.userUuid })[0];
	// ensure user details are valid
	if (!user || !user.CUSTOMER || !user.CUSTOMER.subscription) {
		res.status(400).send();
		return;
	}

	PayPal.cancelSubscription(user.CUSTOMER.subscription).then(() => {
		user.CUSTOMER.subscription = null;
		users.asyncUpdate();
		res.status(200).send();
	}).catch(() => {
		res.status(400).send();
	});
});

module.exports = router;