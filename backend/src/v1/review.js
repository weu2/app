const express = require('express');
const router = express.Router();

const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');

router.get('/list', (req, res) => {
	// show all reviews from all customers
	// to maximise public humiliation
	const reviews = new JsonDB('data/reviews.json');
	res.status(200).send(reviews.getAll());
});

// get further information on a review, such as the customer and professional
router.post('/getInfo', (req, res) => {

	if (!apiValidator.validate(req, {
		reviewId: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const reviews = new JsonDB('data/reviews.json');
	const review = reviews.find({ uuid: req.body.reviewId })[0];
	// check there is a matching review
	if (!review) {
		res.status(400).send();
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ uuid: review.calloutId })[0];
	if (!callout) {
		res.status(400).send();
		return;
	}

	const users = new JsonDB('data/users.json');
	const customer = users.find({ uuid: callout.customer })[0];
	const professional = users.find({ uuid: callout.assignedTo })[0];
	// check users are valid
	if (!customer || !professional) {
		res.status(400).send();
		return;
	}

	res.status(200).send({
		customer: `${customer.firstName} ${customer.lastName}`,
		professional: `${professional.firstName} ${professional.lastName}`
	});
});

module.exports = router;