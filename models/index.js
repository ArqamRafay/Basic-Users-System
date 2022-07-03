const dbConfig = require("../config/connection");
const Sequelize = require("sequelize");
console.log(dbConfig.development)
const sequelize = new Sequelize('testDB', 'postgres', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,

    // pool: {
    //     max: dbConfig.dbInfo.max,
    //     min: dbConfig.dbInfo.min,
    //     acquire: dbConfig.dbInfo.acquire,
    //     idle: dbConfig.pool.idle
    // }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, Sequelize);
module.exports = db;