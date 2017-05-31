const express = require('express');
const reviewModel = require('../model/reviewModel');
const imgUp = require('../model/imgUpload');
const conn = require('../connection/mongooseConnection');

const multer = require('multer');
const upload = multer({
    dest : 'tmp'
});

var router = express.Router();

router.route('/reviews')
    .post(writeReview);

router.route('/reviews/likes')//이거 수정 필요 post 방식으로 처리
    .post(likeReview);

router.route('/reviews')
    .get(showReviews);

router.route('/reviews/:review_id')
    .delete(deleteReview);

router.post('/reviews/uploads', upload.any(), imgUpload);

async function imgUpload(req, res){
    try{
        let localUpload = await imgUp.localUpload(req, res);
        let file = localUpload.files[0];
        let s3Upload = await imgUp.s3Upload(file.filename, file);
        let del = await imgUp.deleteLocalFile(file);
        res.send(del);
    } catch(error){
        console.log(error);
        res.status(789).send({msg:"imgUpload Error"});
    }
}

async function writeReview(req, res) {
    try{
        let reviewData = await reviewModel.sendReview(req);
        conn.connect();
        let writeReview = await reviewModel.writeReview(reviewData);
        let addMyReview = await reviewModel.addMyReview(reviewData);
        console.log(addMyReview);
        conn.disconnect(); // 코드 합친 후 빼줄 것
        res.send(writeReview);
        // 몽고 user collection schema 정의 후 내가 쓴 리뷰에 추가
    } catch( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

function likeReview(req, res) {
    // 내 이메일 정보(로그인 정보) => 내 몽고 my_tastes에 현재 review _id <==post 정보
    // review_id my_tastes array 에 추가
}

async function showReviews(req, res) {

    try{
        conn.connect();
        let showLatestReviews = await reviewModel.showLatestReviews();
        conn.disconnect(); // 코드 합친 후 빼줄 것
        res.send(showLatestReviews);
    } catch( error ){
        console.log(error);
        res.status(error.code).send({msg:error.msg});
    }
}

function deleteReview() {
    //내 이메일 정보(로그인 정보) => 내 몽고 my_tastes 에 현재 review _id <==post 정보
    //review_id params로 삭제
}

module.exports = router;