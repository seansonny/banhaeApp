const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const AllergySchema = require('./allergySchema');
const FeedSchema = require('./feedSchema');

if (mongoose.connection.readyState < 1)
    mongoDB.connect();

showAllergies = function (){
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

showFeeds = function(){
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

function compareNumbers(a, b) {
    return a - b;
}
//numArray.sort(compareNumbers);

async function intersection() {
    try{
        let feeds = await showFeeds();
        let allergies = await showAllergies();
        // console.log(allergies);
        let allergyCollection = [];

        for (let i = 0; i < feeds.length; i++) {
            let aFeedSet = new Set(feeds[i].INGREDIENTS_INDEX);
            let aFeedArray = Array.from(aFeedSet);
            let aFeedAllergy = [];
            aFeedAllergy.push("Feed# " + (i+1));
            //비교 배열=>셋=>배열 + 배열 의 컨캣 결과의 길이 vs 그것의 셋 길이
            for (let j = 0; j < allergies.length; j++) {
                let anAllergy = allergies[j].ingredients;
                let concated = aFeedArray.concat(anAllergy);
                let concatedleng = concated.length;
                let concatedSet = new Set(concated);
                if (concatedleng !== concatedSet.size) {
                    // console.log("Feed #", "Allgergy #", j, "* concatedleng: ", concatedleng);
                    // console.log(j, "* concatedSet.size: ", concatedSet.size);
                    aFeedAllergy.push("# "+ (j+1));
                    // 컬랙션 한번만 만들어 주면 됨
                    // let indi = i+1;
                    // let indj = j+1;
                    // FeedSchema.findOneAndUpdate({INDEX: indi},
                    //     {$push: {"ALLERGY_LISTS" : indj}},
                    //     {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
                    //     .exec(function(err, docs){
                    //         if(err){
                    //             console.log(err);
                    //         }else{
                    //             console.log("success");
                    //         }
                    //     })
                }
            }
            aFeedAllergy.push("'\r\n");
            allergyCollection.push(aFeedAllergy);
        }
        // Array to CSV 나중에 추가
        //console.log(allergyCollection[5]);
        // require('fs').writeFile(
        //
        //     './myAllergy.json',
        //
        //     JSON.stringify(allergyCollection),
        //
        //     function (err) {
        //         if (err) {
        //             console.error('Crap happens');
        //         }
        //     }
        // );


    }catch (error){
        console.log(error);
    }
}


intersection();

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



