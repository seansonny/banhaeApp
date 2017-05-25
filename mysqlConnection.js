/**
 * Created by sswpro on 2017-05-25.
 */
var mysql = require('mysql');
var dbConfig = {
    host : 'banhaerdb.cpu3j20dvqwu.ap-northeast-2.rds.amazonaws.com',
    user : 'rdbadmin',
    password : 'qksgoqksgo123', //비번 없나?? 확인
    port : 3306,
    database : 'BAANHAE'
};

var dbPool = mysql.createPool(dbConfig);

module.exports = dbPool;