var pool = require('../dbConnections/mysqlConnection');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const FeedSchema = require('./feedSchema');
const FedSchema = require('./fedsSchema');

//ingredient MySQL DB는 전체 db2.0 060917 기준
//FEEDS 에서 들고와서 FEDS 에서 수정할 것

showFeeds = function(){
    return new Promise((resolve, reject) =>{
        //const counts = 1;
        FeedSchema.find()
        //.limit(counts) //테스트용
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
        for (let i = 0; i < feeds.length; i++){ //101번 사료 뉴트리나 건강백서 프로페셔널 퍼피 재료중 allergy_num 값 이상있음
            let indi = i+1;
            let warningCount = 0;
            let index = feeds[i].INGREDIENTS_INDEX;
            let names = feeds[i].INGREDIENTS;
            let leng = Math.min(index.length, names.length);
            let aFeedIngred = [];
            for (let j = 0; j < leng; j++){
                try{ //엑셀 리스트 구분자 값(;)이 마지막에 들어가서 빈값이 있어서 try catch문 써줘야함 사료
                    let listIndex = index[j] -1;
                    let anIngred = ingredients[listIndex];

                    let algFlag = false;
                    let warningFlag = false;
                    if(anIngred.allergy_num!==0)
                        algFlag = true;
                    if(anIngred.is_warning!==0){
                        warningFlag= true;
                        warningCount++;
                    }

                    let ingredient = {"name":names[j], "ingredient_id":anIngred.ingredient_id, "is_allergy":algFlag, "is_warning":warningFlag};
                    aFeedIngred.push(ingredient);

                }catch (error){
                    //do nothing
                }
            }
            let result = {"warningCount" : warningCount, "lists" : aFeedIngred};
            FedSchema.findOneAndUpdate({INDEX: indi},
                {$push: {"INGREDIENTS_LISTS" : result}},
                {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
                .exec(function(err, docs){
                    if(err){
                        console.log(err);
                    }else{
                        //console.log("success");
                    }
                })

            //feedsIngredients.push(aFeedIngred);
        }
        //console.log(feedsIngredients[0][0]);

    }catch (error){
        console.log(error);
    }
}

preprocessing();