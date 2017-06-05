var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const conn = require('../database/mongoDbConfig');

if (mongoose.connection.readyState < 1)
    conn.connect();

var reviewSchema = new mongoose.Schema({
    good : String,
    bad : String,
    time_stamp : {type: Date, default: Date.now},
    resized_img : String,
    thumbnail_img : String,
    feed_id : Number,
    user_id : Number,
    dogs : Array,
    rating : Number,
    likes_num : Number
});

//conn.disconnect();
module.exports = mongoose.model('REVIEW', reviewSchema);