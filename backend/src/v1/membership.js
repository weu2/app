const express = require('express');
const multer = require('multer');

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');
const PayPal = require('../common/paypal');

const upload = multer();
const router = express.Router();

router.use((req, res, next) => {
	// first we validate the user
	const userUuid = auth.verifyClaim(req.cookies.claim)
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

	if(!user || !user.CUSTOMER) {
		res.status(400).send();
		return;
	}

	const customer = user.CUSTOMER;
	customer["subscription"] = req.body.subscriptionID;

	users.asyncUpdate();//update({ uuid: req.userUuid }, { CUSTOMER: customer });
	res.status(200).send();

});

module.exports = router;