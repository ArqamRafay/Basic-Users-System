const dbConfig = require("../config/db.config.js");
// const Sequelize = require("sequelize");
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV;
// const config = require(`${__dirname}/../../config/config.js`);
const config = dbConfig
const db = {};
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD,
    {
        logging: false,
        host: config.HOST, port: config.port, dialect: config.dialect,

    });
async function dbconnect() {
    try {
        await sequelize.authenticate().catch((err) => { throw err });
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
dbconnect()
fs
    .readdirSync(__dirname)
    .filter((file) =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach((file) => {
        // console.log(file)
        // const model = Sequelize.import(path.join(__dirname, file));
        var model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    console.log("->", modelName);
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
// sequelize.sync({ alter: true });
// sequelize.sync({force:true});
sequelize.sync();
console.log('Model synchronization')
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
