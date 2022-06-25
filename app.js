const express = require("express")
const cors = require("cors")
const app = express()
const jwt = require("jsonwebtoken")
const expressJWT = require("express-jwt")
const bodyParser = require("body-parser")
const key = require('./config/auth.config')
const PORT = process.env.PORT || 8081;

const db = require("./models");
// db.sequelize.sync();
db.sequelize.sync().then(() => {
    console.log("All models were synchronized successfully.");
    console.log("Drop and re-sync db.");
}, { logging: false });
let secret = 'some_secret';

app.use(cors());
app.options('*', cors)
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

//SECRET FOR JSON WEB TOKEN
/* ALLOW PATHS WITHOUT TOKEN AUTHENTICATION */
app.use(expressJWT({ secret: secret, algorithms: ['HS256'] })
    .unless(
        {
            path: [
                '/token/sign',
                '/encryptedData'
            ]
        }
    ));

//Root Open API
app.get('/', (req, res) => {
    res.json("Welcome to undefined world");
});

/* CREATE TOKEN FOR USE */
app.get('/token/sign', (req, res) => {
    var userData = {
        "name": "Muhammad Bilal",
        "id": "4321"
    }
    let token = jwt.sign(userData, secret, { expiresIn: '150s' })
    res.status(200).json({ "token": token });
})


