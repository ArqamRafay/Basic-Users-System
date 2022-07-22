
const express = require("express"),
    router = express.Router(),
    secure = require("../helpers/secure");

const usersController = require("../controller/user.controller.js");
router.route("/").get((req, res) => usersController.list(secure.decrypt(req), res));
router.route("/createUser").post((req, res) => usersController.create(req, res));
router.route("/findAllUser").get((req, res) => usersController.findAll(req, res));
router.route("/getUserByEmail").post((req, res) => usersController.findUserByEmail(req, res));
router.route("/updateName").post((req, res) => usersController.updateName(req, res));

// localhost:8081/token/sign
// localhost:8081/users/inLineQuery
router.route("/inLineQuery").get((req, res) => usersController.inLineQuery(secure.decrypt(req), res));
// router.route("/forgot-password").post((req, res) => usersController.forgetPass(secure.decrypt(req), res));
module.exports = router;

// FOR POST MEN PREQUEST SCRIPT
// var CryptoJS = require("crypto-js");
// function encrypt(data) {
//     console.log(data)
//     return CryptoJS.AES.encrypt(JSON.stringify(JSON.parse(JSON.stringify(data))), 'secret123456145674125896', { iv: "secret1234561456" }).toString();
// }
// var data = {"data": "how to send encrypted data"};
// // var data = JSON.stringify(pm.request.body.formdata) // {"data": "how to send encrypted data"};
// // var finalData = JSON.parse(data);
// // pm.variables.set("encrypted", encrypt(finalData[0].value));
// pm.variables.set("encrypted", encrypt(data));
// -----------------------------------------------