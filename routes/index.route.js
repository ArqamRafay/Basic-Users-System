let express = require('express'),
    router = express.Router(),
    helmet = require('helmet'),
    jsonwebtoken = require("jsonwebtoken"),
    _secret = require('../config/auth.config.js')._secret;
    
router.use('/users', require('./user.routes'));
router.use(helmet());

/* CREATE TOKEN FOR USE */
router.get('/token/sign', (req, res) => {
    var userData = {
        "name": "Muhammad Bilal",
        "id": "4321"
    }
    let token = jsonwebtoken.sign(userData, _secret, { expiresIn: '950s' })
    res.status(200).json({ "token": token });
})

router.get('/OpenApi', (req, res) => {
    res.json("Welcome to OpenApi world");
});

module.exports = router;
