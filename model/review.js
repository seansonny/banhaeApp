var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    good : String,
    bad : String,
    time_stampe : {type: date, default: Date.now},
    resized_img : String,
    thumbnail_img : String,
    feed_id : Number,
    user_id : Number,
    dogs : Array,
    rating : Number
});

module.exports = mongoose.model('review', reviewSchema);
//
// _id	Object	리뷰id
// good	VARCHAR	좋은점
// bad	VARCHAR	나쁜점
// resized_img	VARCHAR	축소된 사진
// thumbnail_img	VARCHAR	썸네일 이미지
// feed_id	INT	사료정보
// user_id	INT	사용자 정보
// dogs	Array	보유견 중 하나
//
//
// rating	double	평점
// time_stamp	date	작성시간