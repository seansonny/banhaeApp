const mongoose = require('mongoose');
const config = require('./mongoDbConfig.json');

mongoose.set('debug', true);
let mongoDB = {};

mongoDB.connect = function(){
    let db_url = config.db_url;
    connect(config, db_url);
}

function connect(config, db_url){
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