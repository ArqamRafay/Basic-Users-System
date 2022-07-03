const development = {
    database: 'testDB',
    username: 'postgres',
    password: 'admin',
    host: 'localhost',
    dialect: 'postgres' ,
    
    // dialect: 'sqlite' || 'mysql' || 'postgres',
  };
  
const testing = {
    database: 'testdb',
    username: 'root',
    password: '',
    host: 'localhost',
    dialect: 'mysql',
  };
  
  const production = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'sqlite' || 'mysql' || 'postgres',
  };
  const dbInfo = development
  module.exports = {
    // development,
    // testing,
    // production,
    dbInfo
  };
  