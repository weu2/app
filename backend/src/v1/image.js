// this file is for storing and retrieving images from the backend
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const express = require('express');
const router = express.Router();
const multer = require('multer');

// store all images in data/uploads
const imageDir = 'data/uploads/';
const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			// ensure directory exists
			fs.mkdir(imageDir, { recursive: true }, (err) => {
				// if the folder exists don't bother, otherwise error
				if (err && err.code !== 'EEXIST') {
					cb(err);
				} else {
					// store images in /data/uploads/, error if not jpeg
					cb(!file.mimetype.endsWith('jpeg'), imageDir);
				}
			});
		},
		filename: (req, file, cb) => {
			// give each image a random UUID, error if not jpeg
			cb(!file.mimetype.endsWith('jpeg'), `${uuid.v4()}.jpg`);
		}
	})
});

// middleware that is specific to this router
router.use((req, res, next) => {
	next();
});

// assume image is stored in an input named "image" in the multiform data
router.post('/upload', upload.single('image'), (req, res) => {
	if (req.file) {
		// need associate the image with a callout.
		// send back the generated UUID, have to remove the file extension
		res.status(200).send(req.file.filename.split('.')[0]);
	} else {
		// missing file or non-jpeg filetype
		res.status(400).send();
	}
});

router.get('/:id', (req, res) => {
	// image files are named and identified by a uuid
	if (req.params.id) {
		// ensure image exists, otherwise send 404
		fs.access(`./${imageDir}${req.params.id}.jpg`, fs.OK, err => {
			if (err) {
				res.status(404).send(err);
				return;
			}
			// images are stored in backend/data/
			res.sendFile(`${req.params.id}.jpg`, {
				root: path.join(__dirname, '..', '..', imageDir)
			});
		});
	}
});

module.exports = router;