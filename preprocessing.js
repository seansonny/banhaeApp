const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const FeedSchema = require('./model/feedSchema');

if (mongoose.connection.readyState < 1)
    mongoDB.connect();


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

async function preprocessing() {
    try{
        let feeds = await showFeeds();
        let allergies = await showAllergies();

    }catch (error){
        console.log(error);
    }
}

preprocessing();