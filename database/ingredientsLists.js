var pool = require('../dbConnections/mysqlConnection');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const FeedSchema = require('./feedSchema');
const FedSchema = require('./fedsSchema');

if (mongoose.connection.readyState < 1)
    mongoDB.connect();

//ingredient MySQL DB는 전체 db2.0 060917 기준
//FEEDS 에서 들고와서 FEDS 에서 수정할 것

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

getIngredient = function(limits){
    return new Promise((resolve, reject) =>{
        pool.getConnection(function(err, conn) {
            if ( err ){
                return reject(err);
            }

            var sql = 'SELECT ingredient_id, allergy_num, ' +
                'is_warning FROM ingredient ';// +
            //'LIMIT limits = ?';

            conn.query(sql, limits, function(err, results){
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

async function preprocessing() {
    try{
        let feeds = await showFeeds();
        let ingredients = await getIngredient(1);

        let feedsIngredients = [];
        for (let i = 102; i < feeds.length; i++){ //i = 101, indi = 102, ingredients[102], ingredient_id 103 이상
            let indi = i+1;

            let index = feeds[i].INGREDIENTS_INDEX;
            let names = feeds[i].INGREDIENTS;
            let aFeedIngred = [];
            for (let j = 0; j < index.length; j++){
                let ind = index[j] -1;
                let anIngred = ingredients[ind];
                if(ind !== ingredients[ind].ingredient_id - 1)
                    console.log("다름");
                let algFlag = "TRUE";
                let warningFlag = "TRUE";
                if(anIngred.allergy_num===0)
                    algFlag = "FALSE";
                if(anIngred.is_warning===0)
                    warningFlag= "FALSE";

                let ingredient = {"name":names[j], "ingredient_id":anIngred.ingredient_id, "is_allergy":algFlag, "is_warning":warningFlag};

                FedSchema.findOneAndUpdate({INDEX: indi},
                    {$push: {"INGREDIENTS_LISTS" : ingredient}},
                    {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
                    .exec(function(err, docs){
                        if(err){
                            console.log(err);
                        }else{
                            //console.log("success");
                        }
                    })

                aFeedIngred.push(ingredient);

            }

            feedsIngredients.push(aFeedIngred);
        }
        //console.log(feedsIngredients[0][0]);

    }catch (error){
        console.log(error);
    }
}

preprocessing();