var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var userSchema = new mongoose.Schema({
    email : String, //mysql 검색용
    my_reviews : Array, //리뷰 obj _id
    my_tastes : Array //id + 공감1/비공감-1
});

module.exports = mongoose.model('USER', userSchema);