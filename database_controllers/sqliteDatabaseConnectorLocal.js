require('dotenv').config();
const Sequelize = require('sequelize');


// Creating a sequelize instance with sqlite running in memory
//const sequelize = new Sequelize('sqlite::memory:');

// Creating a sequelize instance with sqlite running locally
const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: process.env.DATABASE_PATH || './database/sqlite-main.db',
});

// Testing the connection
(async () => {
    try {
        // Establish connection
        console.time('\x1b[33m [SQLite] Connection has been established successfully. \x1b[0m');
        await sequelize.authenticate();
        console.timeEnd('\x1b[33m [SQLite] Connection has been established successfully. \x1b[0m');

        // Syncrhonize Models
        console.time('\x1b[33m [SQLite] Databse Models synchronized successfully. \x1b[0m');
        const syncModels = require('../models/syncModels')
        await syncModels(sequelize);
        console.timeEnd('\x1b[33m [SQLite] Databse Models synchronized successfully. \x1b[0m');
    } catch (error) {
        console.error('[SQLite] Unable to connect to the database:', error);
    }
})();


module.exports = sequelize;