// const express = require("express")
// const cors = require("cors")
// const app = express()
// const jsonwebtoken = require("jsonwebtoken")
// // const Ejwt = require("express-jwt")
// var { expressjwt: jwt } = require("express-jwt");
// const _secret = require('./config/auth.config')._secret;
// const bodyParser = require("body-parser")
// const key = require('./config/auth.config')
// // const PORT = process.env.PORT || 8081;
// const db = require("./models");
// db.sequelize.sync();
// app.use(cors());
// app.options('*', cors)
// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

// app.use(
//     jwt({
//         secret: _secret,
//         algorithms: ["HS256"],
//     }).unless({ path: ["/token/sign", "/", "/restricted"] })
// );

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}.`);
// });


//Root Open API
// app.get('/', (req, res) => {
//     res.json("Welcome to undefined world");
// });

// app.get('/restricted', (req, res) => {
//     res.json("Welcome to restricted world");
// });

// /* CREATE TOKEN FOR USE */
// app.get('/token/sign', (req, res) => {
//     var userData = {
//         "name": "Muhammad Bilal",
//         "id": "4321"
//     }
//     let token = jsonwebtoken.sign(userData, secret, { expiresIn: '150s' })
//     res.status(200).json({ "token": token });
// })


let server = require('./config/server'),
    nconf = require('nconf'),
    async = require('async'),
    logger = require('winston');

//  require('dotenv').load();
// Set up configs
nconf.use('memory');
// First load command line arguments
nconf.argv();
// Load environment variables
//  nconf.env();
// Load config file for the environment
//  require('./config/environments/' + nconf.get('NODE_ENV'));

logger.info('[APP] Starting server initialization');

async.series(
    [
        // callback => require('./config/initializers/database')(callback),                  //no use
        callback => server(callback)
    ],
    err => {
        if (err) logger.error(`[APP] initialization failed ${err}`);
        else logger.info('[APP] initialized SUCCESSFULLY');
    }
);
