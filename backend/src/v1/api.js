const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    next();
});

router.use('/user', require('./user'));
router.use('/callout', require('./callout'));
router.use('/image', require('./image'));

router.get('/test', (req, res) => {
    res.send({response:true});
});

module.exports = router;