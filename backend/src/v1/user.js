const express = require('express');
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
    next();
});
// define the home page route
router.post('/login', (req, res) => {
    res.send({message:'fuck off'});
})
// define the about route
router.post('/register', (req, res) => {
    res.send({message:'how about no'});
});

module.exports = router;