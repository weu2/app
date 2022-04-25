const express = require('express');
const auth = require('./auth');
const router = express.Router();

router.use((req, res, next) => {
	// first we validate the user
	if(!auth.verifyClaim(req.cookies.claim)) {	
		res.status(401).send();
	}
	next();
});

router.post('/create', (req, res) => {
	// todo: create callout JSON file
	// const callouts = new JsonDB('data/callouts.json');
});

router.post('/status', (req, res) => {
	// todo: callout status
});

router.post('/list', (req, res) => {
	// todo: return list of callouts
});

router.post('/details', (req, res) => {
	// todo: return detail on one specific callout
});

const image = require('../common/image');
router.post('/uploadimage', image.upload.single('image'), (req, res) => {
	if (req.file  && req.body.calloutid ) {
		// some test stuff
		const id = req.body.calloutid;
		// need associate the image with a callout.
		res.status(200).send();
	} else {
		// bad api - missing file or non-jpeg filetype
		res.status(400).send();
	}
});

module.exports = router;