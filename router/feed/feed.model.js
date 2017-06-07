const mongoose = require('mongoose');
const mongoDB = require('../../database/mongoDbConfig');

if (mongoose.connection.readyState < 1)
    mongoDB.connect();

const Schema = mongoose.Schema;

let FeedSchema  = new Schema({
    BRAND_ID: {type: Number},
    CHECKPOINTS: {type: Array},
    FULLNAME: {type: String},
    TARGET_SIZE: {type: String},  //추후변경
    TARGET_AGE: {type: String},     //추후변경
    NAME: {type: String},
    HUMIDITY: {type: String},
    TYPE: {type: String},       //추후변경
    IS_SNACK: {type: Boolean},
    INGREDIENTS_INDEX: {type: Array},
    INGREDIENTS: {type: Array},
    GRAIN_SIZE: {type: String},
    PRICE: {type: Number},
    ORIGIN: {type: String},
    MANUFACTURE: {type: String},
    NUTRITIONS: {type: Array},
    NUTRITIONS_INDEX: {type: Array},
    UNIT: {type: Array},
    PACKAGE: {type: Array},
    RATING: {type: Number},
    REVIEW_NUM: {type: Number}
});

let FeedModel = mongoose.model('FEEDS',FeedSchema,'FEEDS');

//검색할 때 사용할 예정(추후에 like 처리)
FeedModel.getFeedByName = function(feed_name) {
    return new Promise((resolve,reject)=> {
        FeedModel.find({NAME: {$regex:feed_name}}/*{},{NAME:1,REVIEW_NUM:1,RATING:1}*/, (err, feed)=>{
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
FeedModel.getFeedByID = function(feed_id) {
    return new Promise((resolve,reject)=> {
        FeedModel.findOne({_id:feed_id}, (err, feed)=>{
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
        FeedModel.find({},{NAME:1}, (err, feed)=>{
            if(err) {
                reject(err);
            }
            else {
                resolve(feed);
            }
        })
    });
}

//사료 정보추가
FeedModel.addFeed = function() {
    return new Promise((resolve,reject)=> {

        let feed = new FeedModel({
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
            NUTRITION_INDEX: [25,15,3],
            NUTRITION_UNIT: ["이상","이상","이하"],
            PACKAGE_UNIT: [1.2, 2.27, 4.5, 9.98, 13.62],
            RATING: 5,
            REVIEW_NUM: 0
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
        FeedModel.update({_id:feed_id},{$set:{TYPE:1}}, (err)=>{
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
        FeedModel.remove({_id:feed_id}, (err)=>{
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
FeedModel.updateReviewNum = function(feed_id,change) {
    return new Promise((resolve,reject)=> {
        let value = 1;
        if(change) {
           value = -1;
        }

        FeedModel.update({_id:feed_id},{$inc:{REVIEW_NUM:value}}, (err)=>{
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