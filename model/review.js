var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var url = '13.124.126.43:27017/banhae';
mongoose.connect(url);

var db = mongoose.connection;

db.on('error', function(err) {
    console.log('Error : ', err);
});
db.on('open', function() {
    console.log('Open Event');
});

var reviewSchema = new mongoose.Schema({
    good : String,
    bad : String,
    time_stamp : {type: Date, default: Date.now},
    resized_img : String,
    thumbnail_img : String,
    feed_id : Number,
    user_id : Number,
    dogs : Array,
    rating : Number
});

module.exports = mongoose.model('REVIEW', reviewSchema);

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