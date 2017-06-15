const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const FeedSchema = require('./feedSchema');

showFeedsImg = function(){
    return new Promise((resolve, reject) =>{
        //const counts = 1;
        /*let IMAGE_URL = */
        FeedSchema.find({},{IMAGE_URL: 1})
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

async function imgResize() {
    try{
        let feedImgs = await showFeedsImg();
        console.log("IMG url: ", feedImgs[5].IMAGE_URL);

    }catch (error){
        console.log(error);
    }
}

imgResize();