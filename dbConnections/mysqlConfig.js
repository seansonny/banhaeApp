const Sequelize = require('sequelize');
const config = require("./mysqlConfig.json");
const sequelize = new Sequelize(config.database,config.username,config.password, {
    dialect: config.dialect,
    host:config.host,
    port:config.port,
    pool:config.pool,
});

module.exports = sequelize;


//mysql connection 연결
/*var mysql = require('mysql');

var connection = mysql.createConnection({
    database : config.database,
    host     : config.host,
    user     : config.username,
    password : config.password,
    port     : config.port
});

connection.connect(function(err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

connection.query('SELECT * from brand', function(err, rows, fields) {
    if (err) throw err;

    console.log(rows);
    console.log('The solution is: ', rows[0].solution);
});

connection.end();*/

