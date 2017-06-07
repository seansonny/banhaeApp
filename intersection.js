const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const AllergySchema = require('./model/allergySchema');
const FeedSchema = require('./model/feedSchema');

if (mongoose.connection.readyState < 1)
    mongoDB.connect();

function showAllergies(){
    const counts = 1;
    AllergySchema.find()
        .limit(counts)
        .exec(function(err, docs){
        if(err) {
            console.log(err);
            return;
        }
        console.log(docs);
    })
};

function showFeeds(){
    const counts = 1;
    FeedSchema.find()
        .limit(counts)
        .exec(function(err, docs){
            if(err) {
                console.log(err);
                return;
            }
            console.log(docs);
        })
};

//showAllergies();
showFeeds();