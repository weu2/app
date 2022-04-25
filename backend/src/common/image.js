
const fs = require('fs');
const uuid = require('uuid');
const multer = require('multer');

// store all images in data/uploads
const _imageDir = 'data/uploads/';
module.exports.imageDir = _imageDir;

module.exports.upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
            console.log(req.cookies);
			// ensure directory exists
			fs.mkdir(_imageDir, { recursive: true }, (err) => {
				// if the folder exists don't bother, otherwise error
				if (err && err.code !== 'EEXIST') {
					cb(err);
				} else {
					// store images in /data/uploads/, error if not jpeg
					cb(!file.mimetype.endsWith('jpeg'), _imageDir);
				}
			});
		},
		filename: (req, file, cb) => {
			// give each image a random UUID, error if not jpeg
			cb(!file.mimetype.endsWith('jpeg'), `${uuid.v4()}.jpg`);
		}
	})
});