const fs = require('fs');
const path = require('path');
const express = require('express');

const images = require('../common/image');

const router = express.Router();

router.use((req, res, next) => {
	next();
});

// a generic image get api endpoint, 
router.get('/:id', (req, res) => {
	// image files are named and identified by a uuid
	res.download(`./${images.imageDir}${req.params.id}.jpg`);
});

module.exports = router;