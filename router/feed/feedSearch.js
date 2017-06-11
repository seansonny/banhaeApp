const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const AllergySchema = require('../../database/allergySchema');
const FeedSchema = require('../../database/feedSchema');

class myFeed{
}

myFeed.showAllergies = function (){
    return new Promise((resolve, reject) =>{
        //const counts = 1;
        AllergySchema.find()
        //.limit(counts)
            .sort({'index': 1})
            .exec(function(err, docs){
                if(err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            })
    })
};

myFeed.showFeeds = function(){
    return new Promise((resolve, reject) =>{
        //const counts = 1;
        FeedSchema.find()
        //.limit(counts)
            .exec(function(err, docs){
                if(err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            })
    })
};

// // 사료 정보 보기
// > db.feeds.find()
// { "_id" : ObjectId("59375e54e6e3e9bb91ecc80d"), "name" : "feed1", "allergy" : [ "al1", "al2" ] }
// { "_id" : ObjectId("59375e5fe6e3e9bb91ecc80e"), "name" : "feed2", "allergy" : [ "al1", "al3" ] }
// { "_id" : ObjectId("59375e69e6e3e9bb91ecc80f"), "name" : "feed4", "allergy" : [ "al2", "al3" ] }
// { "_id" : ObjectId("59377fc0e6e3e9bb91ecc810"), "name" : "feed5", "allergy" : [ "al2" ] }
// { "_id" : ObjectId("59377fc8e6e3e9bb91ecc811"), "name" : "feed6", "allergy" : [ ] }
//
//
// // 사료 중 특정 알러지 개수 알기
// > db.feeds.aggregate( [ { $project: {name:1, allergy:1, count:{$size: {$setIntersection:[ '$allergy', ['al1', 'al2'] ]}  } } } ] )
// { "_id" : ObjectId("59375e54e6e3e9bb91ecc80d"), "name" : "feed1", "allergy" : [ "al1", "al2" ], "count" : 2 }
// { "_id" : ObjectId("59375e5fe6e3e9bb91ecc80e"), "name" : "feed2", "allergy" : [ "al1", "al3" ], "count" : 1 }
// { "_id" : ObjectId("59375e69e6e3e9bb91ecc80f"), "name" : "feed4", "allergy" : [ "al2", "al3" ], "count" : 1 }
// { "_id" : ObjectId("59377fc0e6e3e9bb91ecc810"), "name" : "feed5", "allergy" : [ "al2" ], "count" : 1 }
// { "_id" : ObjectId("59377fc8e6e3e9bb91ecc811"), "name" : "feed6", "allergy" : [ ], "count" : 0 }
//
//
module.exports = myFeed;