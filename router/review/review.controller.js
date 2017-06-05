const express = require('express');
const reviewModel = require('./review.model');
const imgUp = require('../../model/imgUpload');
const conn = require('../../connection/mongooseConnection');

const multer = require('multer');
const upload = multer({
    dest : 'tmp'
});

var router = express.Router();

router.route('/likes')//이거 수정 필요 post 방식으로 처리
    .post(likeReview);

router.route('/')
    .get(showReviews);

router.route('/:review_id')
    .delete(deleteReview);

router.post('/', upload.any(), writeReview);

async function writeReview(req, res) {
    try{
        let file = req.files[0];
        //console.log(file);
        let sizeTest = await imgUp.sizeTest(file);
        let ratio = 5;
        let width = sizeTest.data.width/ratio;
        //console.log(width);
        let height = sizeTest.data.height/ratio;
        //console.log(height);
        /*let resized = await imgUp.resizingImg(file, width, height);*/      ////////////////////////
        //let serverUpload = await imgUp.serverUpload(req, res); //확인용

        //res.send(sizeTest);
        let directory = 'reviews';
        let s3Path = await imgUp.s3Upload(file.filename, file, directory); //s3Path.url ,s3Path.folder
        let del = await imgUp.deleteLocalFile(file);

        let reviewData = await reviewModel.sendReview(req, s3Path);
        let writeReview = await reviewModel.writeReview(reviewData);
        let addMyReview = await reviewModel.addMyReview(reviewData); // 몽고 user collection schema 정의 후 내가 쓴 리뷰에 추가

        res.send(writeReview);
    } catch( error ){
        console.log(error);
        res.status(error.code).send({msg:error.msg});
    }
}

async function likeReview(req, res) {
    // 현재 내가 좋아한 리뷰? 리뷰에서 카운트 감소 증가
    // 내 이메일 정보(로그인 정보) => 몽고유저에서 my_tastes 에서 삭제, << 추가 할것
    //                           => 아무것도 하지 않은 리뷰이면 추가 + 리뷰에서 likes count 증가
    // 내 몽고 my_tastes에 현재 review _id <==post 정보
    // review_id my_tastes array 에 추가
    try{
        let review = await reviewModel.addMyTastes(req);
        let like = await reviewModel.incrementLikes(review);
        res.send(like);
    }catch(error){
        res.status(error.code).send({msg:error.msg});
    }
}

async function showReviews(req, res) {
    try{
        let showLatestReviews = await reviewModel.showLatestReviews();
        //review_objId도 보내줘야함
        res.send(showLatestReviews);
    } catch( error ){
        console.log(error);
        res.status(error.code).send({msg:error.msg});
    }
}

async function deleteReview(req, res) {

    try{
        let review_id = await reviewModel.deleteReview(req);
        //사진 지워주기
        let deleteResult = await reviewModel.deleteMyReview(review_id);
        res.send(deleteResult);
    } catch( error ){
        console.log(error);
        res.status(error.code).send({msg:error.msg});
    }
}

module.exports = router;