const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const conn = require('../dbConnections/mongoDbConfig');

if (mongoose.connection.readyState < 1)
    conn.connect();

let allergySchema = new mongoose.Schema({
    index :Number,
    class : String,
    name : String,
    ingredients : Array,
});

module.exports = mongoose.model('allergie', allergySchema);