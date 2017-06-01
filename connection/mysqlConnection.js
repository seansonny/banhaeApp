var mysql = require('mysql');
var config = require('./mysqlConfig.json');
var dbConfig = {
    host : config.host,
    user : config.username,
    password : config.password,
    port : config.port,
    database : config.database
};

var dbPool = mysql.createPool(dbConfig);

module.exports = dbPool;