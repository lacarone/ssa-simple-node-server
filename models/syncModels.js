// Importing models
const User = require('./User');
const Post = require('./Post');

// Defining associations
User.hasMany(Post);
Post.belongsTo(User);

// Sync all the models to the database tables
module.exports = async (sequelize) => {
    /**
     * adds tables if they don't exist
     * if alterDatabase is set to true 
     * changes tables to fit the new shape of the model 
     */
    const alterDatabase = true;
    const wipeDatabaseOnAppStart = false;
    const options = {
        alter: alterDatabase,
        force: wipeDatabaseOnAppStart,
    }
    await sequelize.sync(options);
    return;
};