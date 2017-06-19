const mongoose = require('mongoose');
const FeedSchema = require('../../database/feedSchema');
const ObjectID = require('mongodb').ObjectID;

class FeedModel{
}
//검색할 때 사용할 예정(추후에 like 처리)
FeedModel.getFeedByName = function(feed_name) {
    return new Promise((resolve,reject)=> {
        FeedSchema.find({NAME: {$regex:feed_name}}/*{},{NAME:1,REVIEW_NUM:1,RATING:1}*/, (err, feed)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve(feed);
            }
        })
    });
}

//브랜드 상세 정보보기
FeedModel.getFeedByID = function(feed_index) {
    return new Promise((resolve,reject)=> {
        FeedSchema.findOne({INDEX:feed_index}, (err, feed)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve(feed);
            }
        })
    });
}

//브랜드 상세 정보보기
FeedModel.getFeedByIndex = function(feed_index) {
    return new Promise((resolve,reject)=> {
        FeedSchema.findOne({INDEX:feed_index}, (err, feed)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve(feed);
            }
        })
    });
}

//사료 이름 목록 가져오기
FeedModel.getFeedList = function() {
    return new Promise((resolve,reject)=> {
        FeedSchema.find({},{_id:0,NAME:1}, (err, feed)=>{
            if(err) {
                reject(err);
            }
            else {
                FeedSchema.find().count(function(err, count){
                    if(err) {
                        reject(err);
                    } else {
                        resolve({feed:feed,count:count});
                    }
                });
            }
        })
    });
}

//사료 정보추가
FeedModel.addFeed = function() {
    return new Promise((resolve,reject)=> {

        let feed = new FeedSchema({
            BRAND_ID: 126,
            CHECKPOINTS: [2,3,4,5],
            FULLNAME: "Taste of the wild(TOW)",
            TARGET_SIZE: 0,
            TARGET_AGE: 0,
            NAME: "Taste of the wild 훈제연어와 고구마 독",
            HUMIDITY: 0,
            TYPE: 0,
            IS_SNACK: 0,
            INGREDIENT_INDEX: [19, 54, 136],
            INGREDIENT_NAME: ["연어","건조바다생선","고구마"],
            GRAIN_SIZE: "확인불가",
            PRICE: "139990",
            ORIGIN: "미국",
            MANUFACTURE: "미국",
            NUTRITION_NAME: ["조단백","조지방","조섬유"],
            NUTRITIONS_INDEX: [25,15,3],
            NUTRITIONS_UNIT: ["이상","이상","이하"],
            PACKAGE_UNIT: [1.2, 2.27, 4.5, 9.98, 13.62],
            RATING: 5,
            REVIEW_NUM: 0,
            IMAGE_URL: null
        });

        feed.save((err) => {
            if(err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

//사료 정보수정
FeedModel.updateFeed = function(feed_id) {
    return new Promise((resolve,reject)=> {
        FeedSchema.update({_id:feed_id},{$set:{TYPE:1}}, (err)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

//사료 정보삭제
FeedModel.deleteFeed = function(feed_id) {
    return new Promise((resolve,reject)=> {
        FeedSchema.remove({_id:feed_id}, (err)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

//사료에 달린 리뷰 갯수 증가 혹은 감소
FeedModel.updateReviewNum = function(feed_index,change) {
    return new Promise((resolve,reject)=> {
        let value = 1;
        if(change) {
           value = -1;
        }

        FeedSchema.update({INDEX:feed_index},{$inc:{REVIEW_NUM:value}}, (err)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

//사료 별점 수정
FeedModel.updateRating = function(feedData, reviewData) {
    return new Promise((resolve,reject)=> {
        let rating = ((feedData.RATING * feedData.REVIEW_NUM) + reviewData.rating) / (feedData.REVIEW_NUM+1);

        FeedSchema.update({INDEX:reviewData.feed_index},{$set:{RATING:rating}}, (err)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

module.exports = FeedModel;