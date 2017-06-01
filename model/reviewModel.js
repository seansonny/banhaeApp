const ReviewSchema = require('./reviewSchema');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
ObjectId = mongoose.Types.ObjectId;
const UserSchema = require('./mongoUserSchema');
const multer = require('multer');

class Model{
}

Model.sendReview = function(req, imgUrl){
    return new Promise((resolve, reject)=>{

        try{
            let review = new ReviewSchema();
            review.good = req.body.good;
            review.bad = req.body.bad;

            if(imgUrl){
                review.resized_img = imgUrl;
            }

            review.feed_id = req.body.feed_id;
            //유저 정보로 user_id 가져오는 로직 추가
            review.user_id = req.body.user_id;
            review.rating = req.body.rating;
            review.likes_num = 0;
            resolve(review);
        }catch( error ){
            console.log(error);
            reject(error);
        }
    })
};

Model.addMyTastes = function(req){

    return new Promise((resolve, reject) =>{
        const user_info = "asdf@gmail.com";
        const reviewId = req.body.review_objId;

        UserSchema.findOneAndUpdate({email: user_info},
            {$push: {"my_tastes" :  reviewId}},
            {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
            .exec(function(err, docs){
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve(reviewId);
                }
            })
    })
};

Model.incrementLikes = function(review){
    return new Promise((resolve, reject) =>{

        ReviewSchema.findOneAndUpdate({_id: review},
            {$inc: {"likes_num" : 1}})
            .exec(function(err, docs){
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve({msg:"sucess", data:docs});
                }
            })
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
        const user_info = "asdf@gmail.com";
        UserSchema.findOneAndUpdate({email: user_info},
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

Model.deleteReview = function(req){

    return new Promise((resolve, reject) =>{
        const user_info = "asdf@gmail.com";
        const reviewId = req.body.review_objId;
        //없을 때 테스트
        ReviewSchema.deleteOne({_id: reviewId})
            .exec(function(err, docs){
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve(reviewId);
                }
            })
    })
};

Model.deleteMyReview = function(review_id){
    return new Promise((resolve, reject) =>{
        const user_info = "asdf@gmail.com";
        //없을 때 테스트
        UserSchema.findOneAndUpdate({email: user_info},
            {$pull: {"my_reviews" : review_id}},
            {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
            .exec(function(err, docs){
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    resolve("success");
                }
            })
    })
}
module.exports = Model;