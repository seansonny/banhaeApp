var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const conn = require('../connection/mongoDbConfig');

if (mongoose.connection.readyState < 1)
    conn.connect();

var reviewSchema = new mongoose.Schema({
    good : String,
    bad : String,
    time_stamp : {type: Date, default: Date.now},
    resized_img : String,
    img_key : String,
    feed_id : String,
    user_id : String,
    pet_id : Number,
    pet_type : String,
    rating : Number,
    like_users : Array // 좋아요 누른 사람의 email 로 바뀜
});

module.exports = mongoose.model('REVIEW', reviewSchema);