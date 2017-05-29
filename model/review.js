var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var reviewSchema = new mongoose.Schema({
    good : String,
    bad : String,
    time_stamp : {type: Date, default: Date.now},
    resized_img : String,
    thumbnail_img : String,
    feed_id : Number,
    user_id : Number,
    dogs : Array,
    rating : Number
});

module.exports = mongoose.model('REVIEW', reviewSchema);