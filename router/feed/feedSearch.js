const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const FeedSchema = require('../../database/feedSchema');
var pool = require('../../dbConnections/mysqlConnection');

class myFeed{
}

myFeed.getMyPetInfo = function(user_id){
    return new Promise((resolve, reject) =>{
        pool.getConnection(function(err, conn) {
            if ( err ){
                return reject(err);
            }

            var sql = 'SELECT allergy, weight, ' +
                'birthday FROM pets '+
                'WHERE user_id = ?' +
                    'AND main_pet = "1" ';
            //'LIMIT limits = ?';

            conn.query(sql, user_id, function(err, results){
                if ( err ) {
                    conn.release();
                    return reject(err);
                }
                conn.release();
                return resolve(results);
            })
        })
    })
};

myFeed.myFeedsSearch = function(mySearch){
    return new Promise((resolve, reject) =>{
//         let allergy = FeedSchema.aggregate(
//             [
//                 { $project: { A: 1, B: 1, commonToBoth: { $setIntersection: [ "$A", "$B" ] }, _id: 0 } }
//             ]
//         );
//
//         // 사료 중 특정 알러지 개수 알기
// > db.feeds.aggregate( [ { $project: {name:1, allergy:1, count:{$size: {$setIntersection:[ '$allergy', ['al1', 'al2'] ]}  } } } ] )
// { "_id" : ObjectId("59375e54e6e3e9bb91ecc80d"), "name" : "feed1", "allergy" : [ "al1", "al2" ], "count" : 2 }
// { "_id" : ObjectId("59375e5fe6e3e9bb91ecc80e"), "name" : "feed2", "allergy" : [ "al1", "al3" ], "count" : 1 }
// { "_id" : ObjectId("59375e69e6e3e9bb91ecc80f"), "name" : "feed4", "allergy" : [ "al2", "al3" ], "count" : 1 }
// { "_id" : ObjectId("59377fc0e6e3e9bb91ecc810"), "name" : "feed5", "allergy" : [ "al2" ], "count" : 1 }
// { "_id" : ObjectId("59377fc8e6e3e9bb91ecc811"), "name" : "feed6", "allergy" : [ ], "count" : 0 }


        FeedSchema.find({
            $and : [
                { $or : [{TARGET_SIZE:mySearch.size}, {TARGET_SIZE: "ALL"}]},
                { $or : [{TARGET_AGE:mySearch.age}, {TARGET_AGE: "ALL"}]},
                { TYPE : mySearch.type},
                { HUMIDITY : mySearch.humidity},
                { PRICE : {$gte: mySearch.priceMin}},
                { PRICE :{$lte : mySearch.priceMax}}
            ]})
            .exec(function(err, docs){
                if(err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            })
    })
};

// Model.showMostLikeReviews = function() {
//     return new Promise((resolve,reject)=> {
//         ReviewSchema.aggregate([{"$project":{
//             "_id":1,
//             "pet_id":1,
//             "like_users":1,
//             "rating":1,
//             "user_id":1,
//             "feed_id":1,
//             "good":1,
//             "bad":1,
//             "time_stamp":1,
//             "length":{"$size": "$like_users"}}}
//             , {"$sort":{"length":-1}}], (err, feed)=>{
//             if(err) {
//                 reject(err);
//             }
//             else {
//                 resolve(feed);
//             }
//         })
//     });
// }

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