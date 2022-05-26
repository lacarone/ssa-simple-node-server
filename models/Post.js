const { DataTypes } = require('sequelize');
const sequelize = require('../database_controllers/sqliteDatabaseConnectorLocal');


const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        author_id: {
            type: DataTypes.UUIDV4,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });


module.exports = Post;