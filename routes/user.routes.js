
const express = require("express"),
router = express.Router(),
secure = require("../helpers/secure");

const usersController = require("../controller/user.controller.js");
router.route("/").get((req, res) => usersController.list(secure.decrypt(req), res));
router.route("/signup").post((req, res) => usersController.create(secure.decrypt(req), res));
router.route("/login").post((req, res) => usersController.login(secure.decrypt(req), res));
router.route("/social").post((req, res) => usersController.social(secure.decrypt(req), res));
router.route("/uniqueusername").post((req, res) => usersController.uniqueUsername(secure.decrypt(req), res));
router.route("/uniqueemail").post((req, res) => usersController.uniqueEmail(secure.decrypt(req), res));
router.route("/uniquenumber").post((req, res) => usersController.uniqueNumber(secure.decrypt(req), res));
// localhost:8081/token/sign
// localhost:8081/users/inLineQuery
router.route("/inLineQuery").get((req, res) => usersController.inLineQuery(secure.decrypt(req), res));
router.route("/getuserbyid").post((req, res) => usersController.userInfobyId(secure.decrypt(req), res));
router.route("/forgot-password").post((req, res) => usersController.forgetPass(secure.decrypt(req), res));


module.exports = router;


// module.exports = app => {
//     const user = require("../controllers/user.controller.js");

//     var router = require('express').Router();

//     // Creating user 
//     router.post("/", user.create);
  
//     router.get("/inlinequery",user.create);
    
//     // Retrieve all user
//     router.get("/", user.findAll);
  
//     // Retrieve all published user
//     router.get("/published", user.findAllPublished);
  
//     // Retrieve a single Tutorial with id
//     router.get("/:id", user.findOne);
  
//     // Update a Tutorial with id
//     router.put("/:id", user.update);
  
//     // Delete a Tutorial with id
//     router.delete("/:id", user.delete);
  
//     // Create a new Tutorial
//     router.delete("/", user.deleteAll);

//     app.use('/api/user', router);
// }