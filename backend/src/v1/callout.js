const express = require('express');
const auth = require('./auth');
const router = express.Router();
const uuid = require('uuid');

router.use((req, res, next) => {
	// first we validate the user
	if(!auth.verifyClaim(req.cookies.claim)) {	
		res.status(401).send();
	}
	next();
});

router.post('/create', (req, res) => {
	// should be verified already
	const userUuid = auth.verifyClaim(req.cookies.claim);
	const callout = {
		uuid: uuid.v4(), 
		customer: userUuid,
		assignedTo: "",
		locationLat: req.body.locationLat,
		locationLong: req.body.locationLong,
		vehicleRegistrationNumber: req.body.vehicleRegistrationNumber,
		images: []
		status: "new" // new - hasnt been confirmed
					  // waiting - waiting for service professional
					  // accepted - service professional has accepted the callout and is on their way
					  // inprogress - service professional arrived and is fixing car
					  // finished - callout complete
	}
	const callouts = new JsonDB('data/callouts.json');
	callouts.add(callout);
	res.status(200).send({uuid:callout.uuid});
});

router.post('/status', (req, res) => {
	const callouts = new JsonDB('data/callouts.json');
	if(req.body.calloutid) {
		const callout = callouts.find({ uuid: req.body.calloutid });
		// check there is a callout
		if(callout.length != 1) {
			res.status(400).send();
			return;
		}
		// validate user owns callout
		const userUuid = auth.verifyClaim(req.cookies.claim);
		if(callout[0].customer != userUuid) {
			res.status(400).send();
			return;
		}
		res.status(200).send(callout[0]);
	} else {
		res.status(400).send();
	}
});

router.post('/list', (req, res) => {
	const callouts = new JsonDB('data/callouts.json');
	const userUuid = auth.verifyClaim(req.cookies.claim);
	const callout = callouts.find({ customer: userUuid });
	const filtered = callout.filter(co => co.status != "finished");
	res.status(200).send(filtered);
});

const image = require('../common/image');
router.post('/uploadimage', image.upload.single('image'), (req, res) => {
	console.log(req.body);
	if (req.file && req.body.calloutid ) {
		// some test stuff
		const id = req.body.calloutid;
		// need associate the image with a callout.
		res.status(200).send(req.file.filename.split('.')[0]);
	} else {
		// bad api - missing file or non-jpeg filetype
		res.status(400).send();
	}
});

module.exports = router;