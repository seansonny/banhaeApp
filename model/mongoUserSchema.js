var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const conn = require('../dbConnections/mongoDbConfig');

if (mongoose.connection.readyState < 1)
    conn.connect();

var userSchema = new mongoose.Schema({
    email : String, //mysql 검색용
    my_reviews : Array, //리뷰 obj _id
});

module.exports = mongoose.model('USER', userSchema);