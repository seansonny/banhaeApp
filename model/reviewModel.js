const ReviewSchema = require('../model/review');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

class Model{
}

Model.sendReview = function(req){
    return new Promise((resolve, reject)=>{

        try{
            var review = new ReviewSchema();
            review.good = req.body.good;
            review.bad = req.body.bad;
            //이미지 로직 추가
            review.resized_img = req.body.img;
            review.thumbnail_img = req.body.img;
            review.feed_id = req.body.feed_id;
            //유저 정보로 user_id 가져오는 로직 추가
            review.user_id = req.body.user_id;
            review.rating = req.body.rating;
            resolve(review);
        }catch( error ){
            reject(error);
        }
    })
};

Model.writeReview = function(review){
    return new Promise((resolve, reject)=>{

        try{
            console.log('review :', review);
            let result  = review.save();
            resolve(result);
        }catch( error ){
            reject(error);
        }
    })
};

module.exports = Model;