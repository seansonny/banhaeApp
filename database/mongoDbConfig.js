const mongoose = require('mongoose');
const config = require('./mongoDbConfig.json');

mongoose.set('debug', true);
let mongoDB = {};

mongoDB.connect = function(){
    console.log('mongoDB 호출');
    let db_url = config.db_url;
    connect(config, db_url);
}

function connect(config, db_url){

    console.log('connect() 호출됨.');

    mongoose.connect(db_url);
    mongoDB.db = mongoose.connection;

    mongoDB.db.on('err',function(err){
        console.log(err);
    });

    mongoDB.db.on('open',function(){
        console.log('connect success');
    });
}

module.exports = mongoDB;