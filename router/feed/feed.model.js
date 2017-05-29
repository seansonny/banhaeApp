const mongoose = require('mongoose');
const mongoDB = require('../../database/mongoDbConfig');

mongoDB.connect();

const Schema = mongoose.Schema;

let FeedSchema  = new Schema({
    BRAND_ID: {type: Number},
    CHECKPOINTS: {type: Array},
    FULLNAME: {type: String},
    TARGET_SIZE: {type: Number},
    TARGET_AGE: {type: Number},
    NAME: {type: String},
    HUMIDITY: {type: Number},
    TYPE: {type: Number},
    IS_SNACK: {type: Boolean},
    INGREDIENT_INDEX: {type: Array},
    INGREDIENT_NAME: {type: Array},
    GRAIN_SIZE: {type: String},
    PRICE: {type: Number},
    ORIGIN: {type: String},
    MANUFACTURE: {type: String},
    NUTRITION_NAME: {type: Array},
    NUTRITION_INDEX: {type: Array},
    NUTRITION_UNIT: {type: Array},
    PACKAGE_UNIT: {type: Array},
    RATING: {type: Number}
});

let FeedModel = mongoose.model('FEEDS',FeedSchema,'FEEDS');

//검색할 때 사용할 예정(추후에 like 처리)
FeedModel.getFeedByName = function(feed_name) {
    return new Promise((resolve,reject)=> {
        FeedModel.findOne({NAME: feed_name.keyword}, (err, feed)=>{
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
            console.log("good");
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
            RATING: 3.7
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
        })
    });
}

module.exports = FeedModel;