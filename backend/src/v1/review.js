const express = require('express');
const multer = require('multer');

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');

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

router.post('/create', upload.none(), (req, res) => {

	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required: true},
		rating: {type:"numberString", required: true},
		description: {type:"string", required: true},
		dateTime: {type:"numberString", required: true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	// add stars to callout to make it look nice
	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ customer: req.userUuid, uuid: req.body.calloutId })[0];
	if (!callout) {
		res.status(400).send();
		return;
	}
	callouts.update({ customer: req.userUuid, uuid: req.body.calloutId }, {
		review: {
			rating: req.body.rating,
			description: req.body.description,
			dateTime: req.body.dateTime
		}
	});

	res.status(200).send();
});

router.get('/list', (req, res) => {
	
	const callouts = new JsonDB('data/callouts.json');
	// find where review exists
	const filtered = callouts.find({ review: {not: null}});

	// build review json
	const users = new JsonDB('data/users.json');
	const reviews = [];

	filtered.forEach(callout => {
		const customer = users.find({ uuid: callout.customer })[0];
		const professional = users.find({ uuid: callout.assignedTo })[0];
		reviews.push({
			customer: `${customer.firstName} ${customer.lastName}`,
			professional: `${professional.firstName} ${professional.lastName}`,
			review: callout.review
		});
	});
	// show all reviews from all customers to maximise public humiliation
	res.status(200).send(reviews);
});

module.exports = router;