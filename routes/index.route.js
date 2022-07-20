let express = require('express'),
    router = express.Router(),
    oauth = require('../helpers/oauth-server'),
    helmet = require('helmet');

const jsonwebtoken = require("jsonwebtoken")
const _secret = require('../config/auth.config.js')._secret;

router.use('/users', require('./user.routes'));

router.use('/oauth/allow', oauth.authorise(), (req, res) => { return res.status(200).send({ success: true }) })
router.use(helmet());
router.all('/oauth/token', oauth.grant());


router.get('/token/sign', (req, res) => {
    var userData = {
        "name": "Muhammad Bilal",
        "id": "4321"
    }
    let token = jsonwebtoken.sign(userData, _secret, { expiresIn: '150s' })
    res.status(200).json({ "token": token });
})

router.get('*', (req, res) => {
    res.status(200).send({
        message: 'Welcome to the beginning of nothingness.',
    });
});

module.exports = router;
