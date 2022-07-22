
const db = require("../models");
const bcrypt = require('bcrypt')
const _user = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Article
exports.create = async (req, res) => {

    console.log(req.body)
    const { name, email, password, isActive } = req.body
    // Validate request
    if (!(name && email && password)) {
        return res.status(400).send({ msg: "All feild are required!" });
    }
    try {
        const userExists = await _user.findOne({ where: { email: email } });
        if (userExists) {
            return res.status(200).send({ msg: 'User already exists. Please login' })
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await _user.create({
            name: req.body.name,
            password: encryptedPassword,
            email: req.body.email,
            isActive: req.body.isActive
        }).then((data) => {
            return res.status(200).send(data);
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Some error occurred while creating the Article."
        });
    }
};
exports.findAll = (req, res) => {
    try {
        _user.findAll()
            .then((data) => {
                return res.status(200).send(data);
            })
            .catch(err => {
                return res.status(500).send({ msg: "Some error occurred while retrieving tutorials." });
            });
    } catch (error) {
        return res.status(500).send({ msg: "Some error occurred while retrieving tutorials." });
    }
};

exports.findUserByEmail = async (req, res) => {
    console.log(req.body)
    const { email } = req.body
    if (!(email)) {
        return res.status(400).send({ msg: "Email is required!" });
    }
    try {
        const userExists = await _user.findOne({ where: { email: email } });
        if (userExists) {
            return res.status(200).send({ msg: userExists });
        } else {
            return res.status(200).send({ message: "No data found." });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Some error occurred while creating the Article." });
    }

};

exports.updateName = (req, res) => {
    try {
        const userId = req.body.id;
        const _name = req.body.name;
        if (_name) {
            _user.update(
                {
                    name: _name
                }, {
                where: { id: userId }
            }).then((data) => {
                return res.send({ message: "User was updated successfully." });
            })
        } else {
            return res.status(200).send({ message: "Please enter name." });
        }
    } catch (error) {
        return res.status(500).send({ message: "Error in API" });
    }
};

// exports.delete = (req, res) => {
//     const id = req.params.id;

//     Article.destroy({
//         where: { id: id }
//     })
//         .then(num => {
//             if (num == 1) {
//                 res.send({
//                     message: "Article was deleted successfully!"
//                 });
//             } else {
//                 res.send({
//                     message: `Cannot delete Article with id=${id}. Maybe Article was not found!`
//                 });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Could not delete Article with id=" + id
//             });
//         });
// };

// exports.deleteAll = (req, res) => {

//     Article.destroy({
//         where: {},
//         truncate: false
//     })
//         .then(nums => {
//             res.send({ message: `${nums} Tutorials were deleted successfully!` });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all tutorials."
//             });
//         });
// };

// exports.findAllPublished = (req, res) => {
//     Article.findAll({ where: { published: true } })
//         .then(data => {
//             res.send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while retrieving tutorials."
//             });
//         });
// };

// usage of in line query
exports.inLineQuery = async (req, res) => {
    res.status(200).send({ message: "No data gathered" })
};