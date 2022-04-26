const express = require('express');
const uuid = require('uuid');
const multer = require('multer');

const auth = require('./auth');
const JsonDB = require('../common/jsondb');
const apiValidator = require('../common/apiValidator');

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
	
	if(!apiValidator.validate(req, {
		dateTime: {type:"string", required:true},
		locationLat: {type:"string", required:true},
		locationLong: {type:"string", required:true},
		numberPlate: {type:"string", required:true}
	})) {
		res.status(400).send('Missing API parameters');
		return;
	}

	const callouts = new JsonDB('data/callouts.json');
	// should be verified already
	const userUuid = auth.verifyClaim(req.cookies.claim);
	const calloutUuid = uuid.v4();
	callouts.add({
		uuid: calloutUuid, 
		customer: userUuid,
		assignedTo: null,
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

});

router.get('/status', (req, res) => {

	if(!apiValidator.validate(req, {
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
	// validate user owns callout
	const userUuid = auth.verifyClaim(req.cookies.claim);
	if (callout.customer !== userUuid) {
		res.status(400).send();
		return;
	}
	res.status(200).send(callout);
});

router.get('/update', (req, res) => {

	if(!apiValidator.validate(req, {
		calloutid: {type:"string", required:true},
		action: {type:"string", required:true},
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

		switch(req.body.action) {
			case "accept":
				if(callout.status !== "new") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutid }, {assignedTo:userUuid, status:"accepted"});
				break;
			case "arrived":
				if(callout.status !== "accepted") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutid }, {status:"inprogress"});
				break;
			case "finished":
				if(callout.status !== "inprogress") {
					res.status(400).send();
					return;
				}
				callouts.update({ uuid: req.body.calloutid }, {status:"finished"});
				break;
			default:
				res.status(400).send();
				return;
		}
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
		res.status(200).send(filtered);	
	} else if (user.PROFESSIONAL) {
		let servProLat = parseFloat(user.PROFESSIONAL.locationLat);
		let servProLong = parseFloat(user.PROFESSIONAL.locationLong);

		const calloutdb = new JsonDB('data/callouts.json');
		const callouts = calloutdb.find({ status: "new" }).filter(callout => {
			let calloutLat = parseFloat(callout.locationLat, 10);
			let calloutLong = parseFloat(callout.locationLong, 10);
			
			let dLat = servProLat - calloutLat;
			let dLong = servProLong - calloutLong;
			
			let degrees = Math.sqrt((dLat * dLat) + (dLong * dLong));
			let kms = degrees * 110.574; // this is the constant to turn lat and long degrees into kms
			return (kms <= 50.0);
        });
		res.status(200).send(callouts);	
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
		const filtered = callouts.find({ customer: userUuid, uuid: calloutid })[0];
		if (!filtered) {
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