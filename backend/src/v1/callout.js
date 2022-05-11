const express = require('express');
const uuid = require('uuid');
const multer = require('multer');

const auth = require('./auth');
const payment = require('./payment');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');
const geolocation = require('../common/geolocation');

const upload = multer();
const router = express.Router();

router.use((req, res, next) => {
	// first we validate the user
	if (auth.verifyClaim(req.cookies.claim)) {
		next();
	} else {
		res.status(401).send();
	}
});

router.post('/create', upload.none(), (req, res) => {
	
	// for now assume the card number must be provided
	// when memberships are added, it will be stored in users.json instead
	if (!apiValidator.validate(req, {
		description: {type:"string", required:true},
		dateTime: {type:"string", required:true},
		locationLat: {type:"string", required:true},
		locationLong: {type:"string", required:true},
		numberPlate: {type:"string", required:true},
		cardNumber: {type:"string", required:true},
		cardExpMonth: {type:"string", required:true},
		cardExpYear: {type:"string", required:true},
		cardCVC: {type:"string", required:true},
		price: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	// should be verified already
	const userUuid = auth.verifyClaim(req.cookies.claim);
	const calloutUuid = uuid.v4();

	// pay before creating callout
	payment.onDemand(userUuid,
		calloutUuid,
		req.body.price,
		req.body.cardNumber,
		req.body.cardExpMonth,
		req.body.cardExpYear,
		req.body.cardCVC
	).then(() => {
		callouts.add({
			uuid: calloutUuid, 
			customer: userUuid,
			assignedTo: null,
			description: req.body.description,
			dateTime: req.body.dateTime,
			locationLat: req.body.locationLat,
			locationLong: req.body.locationLong,
			numberPlate: req.body.numberPlate,
			images: [],
			status: "new" // new - hasnt been confirmed
							// accepted - service professional has accepted the callout and is on their way
							// inprogress - service professional arrived and is fixing car
							// finished - callout complete
		});
		res.status(200).send({ uuid: calloutUuid });
	}).catch(err =>
		res.status(400).send(err)
	);
});

router.post('/status', (req, res) => {

	if (!apiValidator.validate(req, {
		calloutid: {type:"string", required:true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ uuid: req.body.calloutid })[0];
	// check there is a callout
	if (!callout) {
		res.status(400).send();
		return;
	}
	res.status(200).send(callout);
});

router.post('/nearby', (req, res) => {
	
	if (!apiValidator.validate(req, {
		calloutid: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const userUuid = auth.verifyClaim(req.cookies.claim);
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: userUuid })[0]; // user uuid should be checked already so no need to check it again
	if (user.CUSTOMER) {
		
		const callouts = new JsonDB('data/callouts.json');
		const callout = callouts.find({ uuid: req.body.calloutid })[0];
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
		calloutid: {type:"string", required:true},
		status: {type:"string", required:true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const userUuid = auth.verifyClaim(req.cookies.claim);
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: userUuid })[0]; // user uuid should be checked already so no need to check it again
	if (user.PROFESSIONAL) {
		const callouts = new JsonDB('data/callouts.json');
		const callout = callouts.find({ uuid: req.body.calloutid })[0];
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
				callouts.update({ uuid: req.body.calloutid }, { assignedTo: userUuid, status: req.body.status });
				break;
			case "inprogress":
				if (callout.status !== "accepted") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutid }, { status: req.body.status });
				break;
			case "finished":
				if (callout.status !== "inprogress") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutid }, { status: req.body.status });
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
	
	const userUuid = auth.verifyClaim(req.cookies.claim);
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: userUuid })[0]; // user uuid should be checked already so no need to check it again
	
	if (user.CUSTOMER) {
		const calloutdb = new JsonDB('data/callouts.json');
		const userUuid = auth.verifyClaim(req.cookies.claim);
		const users = new JsonDB('data/users.json');
		const user = users.find({ uuid: userUuid })[0]; // user uuid should be checked already so no need to check it again
		const callout = calloutdb.find({ customer: userUuid }); // te
		const filtered = callout.filter(co => co.status !== "finished");
		res.status(200).send({
			type: "CUSTOMER",
			callouts: filtered
		});	
	} else if (user.PROFESSIONAL) {
		const servProLat = parseFloat(user.PROFESSIONAL.locationLat);
		const servProLong = parseFloat(user.PROFESSIONAL.locationLong);
		
		const calloutdb = new JsonDB('data/callouts.json');
		const callouts = calloutdb.find({ status: {has:["inprogress","accepted"]}, assignedTo: userUuid });
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
		calloutid: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	const callout = callouts.find({ uuid: req.body.calloutid })[0];
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

router.get('/newcallouts', (req, res) => {
	
	const userUuid = auth.verifyClaim(req.cookies.claim);
	const users = new JsonDB('data/users.json');
	const user = users.find({ uuid: userUuid })[0]; // user uuid should be checked already so no need to check it again
	
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

const image = require('../common/image');
router.post('/uploadimage', image.upload.single('image'), (req, res) => {

	if(!apiValidator.validate(req, {
		calloutid: {type:"string", required:true},
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	if (req.file) {
		const calloutid = req.body.calloutid;
		const callouts = new JsonDB('data/callouts.json');
		const userUuid = auth.verifyClaim(req.cookies.claim);
		const callout = callouts.find({ customer: userUuid, uuid: calloutid })[0];
		if (!callout) {
			res.status(400).send();
			return;
		}
		// get the image name from the multr upload
		const imageUuid = req.file.filename.split('.')[0];
		callouts.update({ customer: userUuid, uuid: calloutid }, {images:{append:[imageUuid]}});
		res.status(200).send({ uuid: imageUuid });
	} else {
		// bad api - missing file or non-jpeg filetype
		res.status(400).send();
	}
});

module.exports = router;