const { DataTypes } = require('sequelize');
const sequelize = require('../database_controllers/sqliteDatabaseConnectorLocal');


const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });


module.exports = User;