var express = require('express');
var router = express.Router();
const sequelize = require('../../database_controllers/sqliteDatabaseConnectorLocal');

router.use((req, res, next) => {
    req.sequelizeSQLiteDB = sequelize;
    next();
});

/* GET generate fake user accounts. */
require('./users/_generateUsers')(router);
/* GET users and their recent posts with pagination built in. */
require('./users/_users')(router);


module.exports = router;
