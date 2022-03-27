const express = require('express');
const router = express.Router()

router.use((req, res, next) => {
	next();
});

router.post('/login', (req, res) => {
	console.log(req.body);
	res.send({message:'fuck off'});
})

router.post('/register', (req, res) => {
	res.send({message:'how about no'});
});

module.exports = router;