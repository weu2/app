const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
    next();
});

router.use('/user', require('./user'));
router.use('/callout', require('./callout'));
router.use('/membership', require('./membership'));
router.use('/report', require('./report'));
router.use('/image', require('./image'));
router.use('/review', require('./review'));

router.get('/test', (req, res) => {
    res.send({response:true});
});

module.exports = router;