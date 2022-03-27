const express = require('express');
const router = express.Router();
const path = require('path');

// this is the catch all express router that sinks all files 
// to either a static request or the index.html
// added it here because it looks ugly in index.js

router.use((req, res, next) => {
    next();
});
router.use('/', express.static(path.resolve('../frontend/build')));
router.get('*', (req, res) => {
    res.sendFile(path.resolve('../frontend/build/', 'index.html'));
});
module.exports = router;