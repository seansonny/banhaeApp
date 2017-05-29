var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

class Connection{
}

Connection.connect = function () {
    return new Promise((resolve, reject) =>{
        try{
            let url = '13.124.126.43:27017/banhae';
            mongoose.connect(url);
            let db = mongoose.connection;
            db.on('open' ? resolve() : reject());

        } catch( error ){}
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