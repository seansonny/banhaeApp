var mongoose = require('mongoose');
const config = require('./mongoDbConfig.json');
mongoose.Promise = require('bluebird');

class Connection{
}

Connection.connect = function () {
    return new Promise((resolve, reject) =>{
        try{
            let url = config.db_url;
            mongoose.connect(url);
            let db = mongoose.connection;

            db.on('open', ()=>{
                console.log("connection open");
                resolve();
                return;
            });
            db.on('error', ()=>{
                console.log("connection error");
                reject();
                return;
            });

        } catch( error ){
            console.log(error);
            reject();
        }
    })
};

Connection.disconnect = function (){
    return new Promise((resolve, reject)=>{
        try{
            mongoose.disconnect();
            resolve();
        }catch( error ){
            reject();
        }
    })
};

module.exports = Connection;