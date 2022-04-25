const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
	next();
});

router.post('/create', (req, res) => {
	// todo: create callout JSON file
	// const callouts = new JsonDB('data/callouts.json');
});

router.post('/status', (req, res) => {
	// todo: callout status
});

router.post('/calloutview', (req, res) => {
	// todo: return list of callouts
});

router.post('/calloutdetails', (req, res) => {
	// todo: return detail on one specific callout
});

module.exports = router;