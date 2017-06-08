const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const AllergySchema = require('./model/allergySchema');
const FeedSchema = require('./model/feedSchema');

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

// UserSchema.findOneAndUpdate({email: user_info},
//     {$push: {"my_reviews" : review._id}},
//     {safe: true, upsert: true})
//     .exec

async function intersection() {
    try{
        let feeds = await showFeeds();
        let allergies = await showAllergies();
        // console.log(allergies);
        let allergyCollection = [];

        for (let i = 0; i < feeds.length; i++) {
            let aFeedSet = new Set(feeds[0].INGREDIENTS_INDEX);
            let aFeedArray = Array.from(aFeedSet);
            let aFeedAllergy = [];
            //비교 배열=>셋=>배열 + 배열 의 컨캣 결과의 길이 vs 그것의 셋 길이
            for (let j = 0; j < allergies.length; j++) {
                let anAllergy = allergies[j].ingredients;
                let concated = aFeedArray.concat(anAllergy);
                let concatedleng = concated.length;
                let concatedSet = new Set(concated);
                if (concatedleng !== concatedSet.size) {
                    // console.log("Feed #", "Allgergy #", j, "* concatedleng: ", concatedleng);
                    // console.log(j, "* concatedSet.size: ", concatedSet.size);
                    aFeedAllergy.push("Feed# " + (i+1), "Allgergy# "+ (j+1));
                }
            }
            allergyCollection.push(aFeedAllergy);
        }
        console.log(allergyCollection[0]);


    }catch (error){
        console.log(error);
    }
}


intersection();