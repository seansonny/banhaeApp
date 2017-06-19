var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const conn = require('../dbConnections/mongoDbConfig');

if (mongoose.connection.readyState < 1)
    conn.connect();

var reviewSchema = new mongoose.Schema({
    good : String,
    bad : String,
    resized_img : String,
    img_key : String,
    feed_index : Number,     //feed_id : String,에서 바뀜
    user_id : String,
    pet_id : Number,
    rating : Number,
    time_stamp : {type: Date, default: Date.now},
    
    like_users : Array, // 좋아요 누른 사람의 email 로 바뀜
    pet_type : String,
    // 추가
    pet_age : Number,
    pet_weight : Number,
    pet_gender : Number,
    pet_image : String,
    pet_name : String
});

module.exports = mongoose.model('REVIEW', reviewSchema);