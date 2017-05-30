const ReviewSchema = require('./reviewSchema');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const UserSchema = require('./mongoUserSchema');

class Model{
}

Model.sendReview = function(req){
    return new Promise((resolve, reject)=>{

        try{
            let review = new ReviewSchema();
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
            console.log(error);
            reject(error);
        }
    })
};

Model.writeReview = function(review){
    return new Promise((resolve, reject)=>{

        try{
            let result  = review.save();
            resolve(result);
        }catch( error ){
            console.log(error);
            reject(error);
        }
    })
};

Model.addMyReview = function(review){
    return new Promise((resolve, reject)=>{
        //로그인 정보를 통해 user collection을 조회 하고
        //그 중에서 my_reviews document(배열)에 review _id를 추가
        UserSchema.findOneAndUpdate({email: "asdf@gmail.com"},
            {$push: {"my_reviews" : review._id}},
            {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
            .exec(function(err, docs){
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve(docs);
                }
            })
    })
};

Model.showLatestReviews = function(){
    return new Promise((resolve, reject)=>{
        const reviewCounts = 3;
        ReviewSchema.find()
            .sort({'time_stamp': -1})
            .limit(reviewCounts).exec(function(err, docs){
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            console.log(docs);
            resolve(docs);
        })
    })
};

module.exports = Model;