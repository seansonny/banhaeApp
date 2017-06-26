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
                    'AND main_pet = "2" ';

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
        FeedSchema.aggregate( [
            {$match: {TYPE : mySearch.type, HUMIDITY : mySearch.humidity,
                            $and : [{PRICE :{$gte : mySearch.priceMin}},{PRICE :{$lte : mySearch.priceMax}}],
                                            $or : [{TARGET_AGE:mySearch.targetAge}, {TARGET_AGE: "ALL"}],
                                            $or : [{TARGET_SIZE:mySearch.size}, {TARGET_SIZE: "ALL"}] }},
                                { $project:
                                    {INDEX:1, name:1, ALLERGY_LISTS:1, FULLNAME:1, BRAND_ID:1,CHECKPOINTS:1,PACKAGE:1,
                                        TARGET_SIZE:1, TARGET_AGE:1,HUMIDITY:1, TYPE:1, GRAIN_SIZE:1,
                                        FEED_ID:1, NAME:1, PRICE:1, ORIGIN:1, MANUFACTURE:1, RATING:1, REVIEW_NUM:1,
                                        NUTRITIONS_LISTS:1, INGREDIENTS_LISTS:1, IMAGE_URL:1,
                                        allergyCount:{$size: {$setIntersection:[ '$ALLERGY_LISTS', mySearch.allergy ]}}
                                    } },
                                    {"$sort":{"allergyCount":1}}] )
            .exec(function(err, docs){
                if(err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            });
    })
};

module.exports = myFeed;