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
	
	if(apiValidator.validate(req, {
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
						// waiting - waiting for service professional
						// accepted - service professional has accepted the callout and is on their way
						// inprogress - service professional arrived and is fixing car
						// finished - callout complete
	});
	res.status(200).send({ uuid: calloutUuid });

});

router.get('/status', (req, res) => {

	if(apiValidator.validate(req, {
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

router.get('/list', (req, res) => {
	const callouts = new JsonDB('data/callouts.json');
	const userUuid = auth.verifyClaim(req.cookies.claim);
	const callout = callouts.find({ customer: userUuid });
	const filtered = callout.filter(co => co.status !== "finished");
	res.status(200).send(filtered);
});

const image = require('../common/image');
router.post('/uploadimage', image.upload.single('image'), (req, res) => {

	if(apiValidator.validate(req, {
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