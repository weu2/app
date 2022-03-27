const express = require('express');
const router = express.Router()

const jsondb = require('../common/jsondb');

router.use((req, res, next) => {
	next();
});

router.post('/login', (req, res) => {

    const db = new jsondb();
    console.log(db.find({notes:"Some Notes 11"}));

    console.log(req.body);
    res.send({message:'fuck off'});
})

router.post('/register', (req, res) => {
	res.send({message:'how about no'});
});

module.exports = router;