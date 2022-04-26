const express = require('express');
const router = express.Router();
const auth = require('./auth');
const uuid = require('uuid');
const JsonDB = require('../common/jsondb');
const multer = require('multer');
const upload = multer();

router.use((req, res, next) => {
	// first we validate the user
	if (auth.verifyClaim(req.cookies.claim)) {
		next();
	} else {
		res.status(401).send();
	}
});

router.post('/create', upload.none(), (req, res) => {
	if (req.body.dateTime && req.body.locationLat && req.body.locationLong && req.body.numberPlate) {
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
	} else {
		res.status(400).send('Missing API parameters');
	}
	
});

router.get('/status', (req, res) => {
	const callouts = new JsonDB('data/callouts.json');
	if (req.body.calloutid) {
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
	} else {
		res.status(400).send();
	}
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
	if (req.file && req.body.calloutid) {
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