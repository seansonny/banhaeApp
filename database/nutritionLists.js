const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const FeedSchema = require('./feedSchema');
const FedSchema = require('./fedsSchema');

//FEEDS 에서 들고와서 FEDS 에서 수정할 것

showFeeds = function(){
    return new Promise((resolve, reject) =>{
        FeedSchema.find()
            .exec(function(err, docs){
                if(err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            })
    })
};

addMainNuts = function(feeds){
    return new Promise((resolve, reject) => {
        for(let i = 0; i < feeds.length; i++){
            let amounts = feeds[i].NUTRITIONS_INDEX;
            let mainNut = {"main" : [amounts[0], amounts[1], amounts[2], amounts[3]]};
            let indi = i+1;

            FedSchema.findOneAndUpdate({INDEX: indi},
                {$push: {"NUTRITIONS_LISTS" : mainNut}},
                {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
                .exec(function(err, docs){
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        console.log("success");
                    }
                })
        }
        resolve("success");
    });
};

addExtraNuts = function(feeds){
    return new Promise((resolve, reject) => {
        for(let i = 0; i < feeds.length; i++){
            let amounts = feeds[i].NUTRITIONS_INDEX;
            let names = feeds[i].NUTRITIONS;
            let units = feeds[i].UNIT;
            let minleng = Math.min(amounts.length, names.length, units.length);

            let extraList = [];
            for(let j = 4; j < minleng; j++){
                let extra;
                if (units[j] ==="이상"||units[j] ==="이하"){
                    extra = names[j]+ " (" +amounts[j]+"%) "+units[j];
                }else{
                    extra = names[j]+" "+amounts[j]+" "+units[j];
                }
                extraList.push(extra);
            }

            let indi = i+1;
            let extraNut = {"extra" : extraList};

            FedSchema.findOneAndUpdate({INDEX: indi},
                {$push: {"NUTRITIONS_LISTS" : extraNut}},
                {safe: true, upsert: true}) //safe upsert option 있어도 없어도 됨
                .exec(function(err, docs){
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        console.log("success");
                    }
                })
        }
        resolve("success");
    });
};


async function nutritionLists() {
    try{
        let feeds = await showFeeds();
        let mainNutrition = await addMainNuts(feeds);
        console.log("Main Nutrition added: ", mainNutrition);
        let extraNuts = await addExtraNuts(feeds);
        console.log("Extra Nutrition added: ", extraNuts);

    }catch (error){
        console.log(error);
    }
}

nutritionLists();