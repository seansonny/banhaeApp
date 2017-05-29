const ReviewSchema = require('../model/review');
//const mongoose = require('mongoose');

class Model{
}

var review = new ReviewSchema();

// var dbConnection = mongoose.connection;
// dbConnection.on('error', console.error);
// dbConnection.once('open', function(){
//     console.log("Connected to mongod server");
// });
//
// // var options = {
// //     user: 'mongoAdmin',
// //     pass: 'myPassword'
// // }; //connection 두번째 parameter로 설정
// //http://mongoosejs.com/docs/connections.html
//
// mongoose.connect('13.124.126.43:27017');

module.exports = Model;