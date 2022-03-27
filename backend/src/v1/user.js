const express = require('express');
const router = express.Router()

const jsondb = require('../common/jsondb');

router.use((req, res, next) => {
	next();
});

router.post('/login', (req, res) => {

    const db = new jsondb("data/users.json");
    db.add({usr:"steve", time:"12 oclock"});
    console.log(db.find({usr:"steve"}));
    
    console.log(req.body);
    res.send({message:'fuck off'});
})

router.post('/register', (req, res) => {
	res.send({message:'how about no'});
});

module.exports = router;