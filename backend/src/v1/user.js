const express = require('express');
const router = express.Router();
const auth = require('./auth');

router.use((req, res, next) => {
	next();
});

router.post('/login', (req, res) => {
    if(!req.body.email && !req.body.pwd)
        res.send({status:'invalid api parameters'});
    else 
        auth.authenticate(req.body.email, req.body.pwd)
            .then( claim => res.send({ status : 'ok' , claim : claim}))
            .catch( r => res.send({ status : r }));
})

router.get('/maketestlogin', (req, res) => {
    auth.makeFakeUser("test@example.com", "test");
	res.send({ status : 'ok' });
});

router.post('/register', (req, res) => {
    if(!req.body.email && !req.body.pwd && !req.body.firstname && !req.body.lastname && !req.body.iama)
        res.send({status:'invalid api parameters'});
    else {
        auth.createUser(req.body.email, req.body.pwd, req.body.firstname, req.body.lastname, req.body.iama);
        res.send({ status : 'ok' });
    }
});

module.exports = router;