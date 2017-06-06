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
    img_key : String,
    feed_id : Number,
    user_id : Number,
    pet_id : Number,
    rating : Number,
    like_users : String // 좋아요 누른 사람의 email 로 바뀜
});

//conn.disconnect();
module.exports = mongoose.model('REVIEW', reviewSchema);