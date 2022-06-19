const express = require("express")
const cors = require("cors")
const app = express()
const jwt = require("jsonwebtoken")
const expressJWT = require("express-jwt")
const bodyParser = require("body-parser")
const PORT = process.env.PORT || 8081;

app.use(cors());
app.options('*', cors)
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

let secret = 'somesecretkey'


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

/* CODE IN BETWEEN */
//SECRET FOR JSON WEB TOKEN

// app.use(expressJWT({secret:secret, algorithm:['HS256']})).unless({
//     path: [
//         '/token'
//     ]
// })

//Root Open API
app.get('/', (req, res) => {
    res.json("Welcome to undefined world");
});
