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
	if (req.params.id) {
		// ensure image exists, otherwise send 404
		fs.access(`./${images.imageDir}${req.params.id}.jpg`, fs.OK, err => {
			if (err) {
				res.status(404).send(err);
				return;
			}
			// images are stored in backend/data/
			res.sendFile(`${req.params.id}.jpg`, {
				root: path.join(__dirname, '..', '..', images.imageDir)
			});
		});
	}
});

module.exports = router;