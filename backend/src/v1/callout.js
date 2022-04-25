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
		const callout = callouts.find({ uuid: req.body.calloutid });
		// check there is a callout
		if (callout.length === 0) {
			res.status(400).send();
			return;
		}
		// validate user owns callout
		const userUuid = auth.verifyClaim(req.cookies.claim);
		if (callout[0].customer !== userUuid) {
			res.status(400).send();
			return;
		}
		res.status(200).send(callout[0]);
	} else {
		res.status(400).send();
	}
});

// list callouts a customer submitted
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
		// need to associate the image with a callout
		const callouts = new JsonDB('data/callouts.json');
		const userUuid = auth.verifyClaim(req.cookies.claim);
		const filtered = callouts.find({ customer: userUuid, uuid: req.body.calloutid })[0];
		// add image uuid to array
		const imageUuid = req.file.filename.split('.')[0];
		// make sure it doesn't already exist
		if (!filtered.images.includes(imageUuid)) {
			filtered.images.push(imageUuid);
		}
		// update callout json
		callouts.asyncUpdate();
		// send image uuid
		res.status(200).send({ uuid: imageUuid });
	} else {
		// bad api - missing file or non-jpeg filetype
		res.status(400).send();
	}
});

module.exports = router;