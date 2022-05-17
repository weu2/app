const express = require('express');
const uuid = require('uuid');
const multer = require('multer');

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');
const geolocation = require('../common/geolocation');
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

router.post('/create', upload.none(), (req, res) => {
	
	if (!apiValidator.validate(req, {
		description: {type:"string", required:true},
		dateTime: {type:"numberString", required:true},
		locationLat: {type:"numberString", required:true},
		locationLong: {type:"numberString", required:true},
		numberPlate: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: req.userUuid })[0];
	// only customers can create callouts
	if (!user.CUSTOMER) {
		res.status(400).send();
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const calloutUuid = uuid.v4();
	callouts.add({
		uuid: calloutUuid, 
		customer: req.userUuid, // request will contain user uuid because the middlewear handler resolves it
		assignedTo: null,
		review: null,
		description: req.body.description,
		dateTime: req.body.dateTime,
		locationLat: req.body.locationLat,
		locationLong: req.body.locationLong,
		numberPlate: req.body.numberPlate,
		paymentId: user.CUSTOMER.subscription ?? null, // use plan ID as payment ID
		paymentComplete: user.CUSTOMER.subscription !== null, // subscriptions mean payments are complete
		images: [],
		status: "new" // new - hasnt been confirmed
						// accepted - service professional has accepted the callout and is on their way
						// inprogress - service professional arrived and is fixing car
						// finished - callout complete
	});
	res.status(200).send({ uuid: calloutUuid });
});

router.post('/status', (req, res) => {

	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required:true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ uuid: req.body.calloutId })[0];
	// check there is a callout
	if (!callout) {
		res.status(400).send();
		return;
	}
	res.status(200).send(callout);
});

router.post('/nearby', (req, res) => {
	
	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again
	if (user.CUSTOMER) {
		
		const callouts = new JsonDB('data/callouts.json');
		const callout = callouts.find({ uuid: req.body.calloutId })[0];
		// check there is a callout
		if (!callout) {
			res.status(400).send();
			return;
		}
		const calloutLat = parseFloat(callout.locationLat);
		const calloutLong = parseFloat(callout.locationLong);

		const returnList = [];
		const professionals = users.hasKeys(["PROFESSIONAL"]);
		professionals.forEach(user => {

			const servProLat = parseFloat(user.PROFESSIONAL.locationLat);
			const servProLong = parseFloat(user.PROFESSIONAL.locationLong);

			const distance = geolocation.getDistance(
				servProLat,
				servProLong,
				calloutLat,
				calloutLong
			);
			if (distance <= 50.0) {
				returnList.push({
					name: `${user.firstName} ${user.lastName}`,
					position: [servProLat, servProLong],
					distance: distance
				});
			}
		});
		res.status(200).send(returnList);
	}
});

router.post('/update', (req, res) => {

	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required:true},
		status: {type:"string", required:true},
		price: {type:"numberString", required: req.body.status === "accepted"},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again
	if (user.PROFESSIONAL) {
		const callouts = new JsonDB('data/callouts.json');
		const callout = callouts.find({ uuid: req.body.calloutId })[0];
		// check there is a callout
		if (!callout) {
			res.status(400).send();
			return;
		}
		switch (req.body.status) {
			case "accepted":
				if (callout.status !== "new") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutId }, {
					assignedTo: req.userUuid,
					price: req.body.price,
					status: req.body.status
				});
				break;
			case "inprogress":
				if (callout.status !== "accepted") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutId }, { status: req.body.status });
				break;
			case "finished":
				if (callout.status !== "inprogress") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutId }, { status: req.body.status });
				break;
			default:
				res.status(400).send();
				return;
		}
		res.status(200).send(callout);
	} else {
		res.status(400).send();
	}
});

router.get('/list', (req, res) => {
	
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again
	
	if (user.CUSTOMER) {
		const calloutdb = new JsonDB('data/callouts.json');
		const users = new JsonDB('data/users.json');
		const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again
		const callouts = calloutdb.find({ customer: req.userUuid });
		// include finished callouts so customers can leave reviews
		res.status(200).send({
			type: "CUSTOMER",
			callouts: callouts
		});	
	} else if (user.PROFESSIONAL) {
		const servProLat = parseFloat(user.PROFESSIONAL.locationLat);
		const servProLong = parseFloat(user.PROFESSIONAL.locationLong);
		
		const calloutdb = new JsonDB('data/callouts.json');
		const callouts = calloutdb.find({ status: {has:["inprogress","accepted","finished"]}, assignedTo: req.userUuid });
		res.status(200).send({
			type: "PROFESSIONAL",
			callouts: callouts,
			position: [servProLat, servProLong] // for easier frontend display
		});
	} else {
		res.status(401).send();
	}
});

router.post('/assignee', (req, res) => {

	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ uuid: req.body.calloutId })[0];
	// check there is a callout and it is assigned
	if (!callout || !callout.assignedTo) {
		res.status(400).send();
		return;
	}
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: callout.assignedTo })[0];
	// check user is valid
	if (!user) {
		res.status(400).send();
		return;
	}
	res.status(200).send({ name: `${user.firstName} ${user.lastName}` });
});

router.get('/listNew', (req, res) => {
	
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: req.userUuid })[0]; // user uuid should be checked already so no need to check it again
	
	if (user.PROFESSIONAL) {
		const servProLat = parseFloat(user.PROFESSIONAL.locationLat);
		const servProLong = parseFloat(user.PROFESSIONAL.locationLong);
		
		const calloutdb = new JsonDB('data/callouts.json');
		const callouts = calloutdb.find({ status: "new" }).filter(callout => {
			const distance = geolocation.getDistance(
				servProLat,
				servProLong,
				parseFloat(callout.locationLat),
				parseFloat(callout.locationLong)
			)
			return distance <= 50.0;
        });
		res.status(200).send({
			type: "PROFESSIONAL",
			callouts: callouts
		});
	} else {
		res.status(401).send();
	}
});

router.get('/prefetchPaymentInfo', (req, res) => {
	PayPal.generateClientToken().then(clientToken => {
		const clientId = PayPal.clientId;
		res.status(200).send({ 
			clientId : clientId, 
			clientToken : clientToken 
		});
	}).catch(() => {
		res.status(400).send();
	});
});

router.post('/cancelPayment', (req, res) => {

	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required: true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ customer: req.userUuid, uuid: req.body.calloutId })[0];
	if (!callout) {
		res.status(400).send();
		return;
	}

	callouts.update({ customer: req.userUuid, uuid: req.body.calloutId }, { paymentId: null });
});

router.post('/createPayment', (req, res) => {

	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required: true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ customer: req.userUuid, uuid: req.body.calloutId })[0];
	if (!callout) {
		res.status(400).send();
		return;
	}

	PayPal.createOrder(callout.price).then(data => {
		callouts.update({ customer: req.userUuid, uuid: req.body.calloutId }, { paymentId: data.id });
		res.status(200).send(data);
	}).catch(() => {
		res.status(400).send();
	});
});

router.post('/capturePayment', (req, res) => {

	if (!apiValidator.validate(req, {
		calloutId: {type:"string", required: true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ customer: req.userUuid, uuid: req.body.calloutId })[0];
	if (!callout) {
		res.status(400).send();
		return;
	}

	PayPal.capturePayment(callout.paymentId).then(data => {
		if (data.status === "COMPLETED") {
			callouts.update({ customer: req.userUuid, uuid: req.body.calloutId }, { paymentComplete: true });
			res.status(200).send(data);
		} else {
			res.status(400).send(data);
		}
	})
});

const image = require('../common/image');
router.post('/uploadImage', image.upload.single('image'), (req, res) => {

	if(!apiValidator.validate(req, {
		calloutId: {type:"string", required:true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	if (req.file) {
		const calloutId = req.body.calloutId;
		const callouts = new JsonDB('data/callouts.json');
		const callout = callouts.find({ customer: req.userUuid, uuid: calloutId })[0];
		if (!callout) {
			res.status(400).send();
			return;
		}
		// get the image name from the multr upload
		const imageUuid = req.file.filename.split('.')[0];
		callouts.update({ customer: req.userUuid, uuid: calloutId }, {images:{append:[imageUuid]}});
		res.status(200).send({ uuid: imageUuid });
	} else {
		// bad api - missing file or non-jpeg filetype
		res.status(400).send();
	}
});

module.exports = router;