const ReviewSchema = require('../../model/reviewSchema');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
ObjectId = mongoose.Types.ObjectId;
const UserSchema = require('../../model/mongoUserSchema');
const multer = require('multer');

class Model{
}

Model.sendReview = function(req, imgInfo){
    return new Promise((resolve, reject)=>{
        try{
            let review = new ReviewSchema();
            review.good = req.body.good;
            review.bad = req.body.bad;

            if(imgInfo){
                review.resized_img = imgInfo.url;
                review.img_key = imgInfo.itemKey;
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

Model.showMyReviews = function(req){
    return new Promise((resolve, reject) =>{
        const user_info = "asdf@gmail.com";
        let mongoUser = UserSchema.findOne({email: user_info});
        mongoUser.exec(function (err, user){
            if (err){
                reject(err);
            } else{
                resolve(ReviewSchema.find({'_id': { $in: user.my_reviews}}));
            }
        })
    })
};

Model.addLikedUsers = function(req){

    return new Promise((resolve, reject) =>{
        const user_info = "sswpro@gmail.com";
        const reviewId = req.body.review_objId; //type obj id 로 되어야 하는지 체크>> 아니여도 됨
        let likedUsers = req.body.is_liked; //누른 사람의 이메일 (배열)

        let isLiked = false;
        if(likedUsers !== undefined){
            likedUsers = likedUsers instanceof Array ? likedUsers : [likedUsers];
            for (var i = 0; i < likedUsers.length; i++){
                if(likedUsers[i] === user_info)
                    isLiked = true;
            }
        }

        if(!isLiked){
            ReviewSchema.findOneAndUpdate({_id: reviewId},
                {$push: {"like_users" :  user_info}},
                {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
                .exec(function(err, docs){
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        resolve(likedUsers);
                    }
                })
        }else{
            ReviewSchema.findOneAndUpdate({_id: reviewId},
                {$pull: {"like_users" :  user_info}},
                {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
                .exec(function(err, docs){
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        resolve(likedUsers);
                    }
                })
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

Model.deleteReview = function(review_id){

    return new Promise((resolve, reject) =>{
        const user_info = "asdf@gmail.com";
        let reviewData;
        //없을 때 테스트
        ReviewSchema.find({_id: review_id})
            .exec(function(err, results){
                if(err){
                    console.log(err);
                    reject(err);
                }else{
                    reviewData = results;
                    ReviewSchema.remove({_id: review_id})
                        .exec(function(err){
                            if(err){
                                console.log(err);
                                reject(err);
                            }else{
                                resolve(reviewData);
                            }
                        })
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