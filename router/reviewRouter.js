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
        let serverUpload = await imgUp.serverUpload(req, res);
        let file = serverUpload.files[0];
        let directory = 'reviews';
        let s3Path = await imgUp.s3Upload(file.filename, file, directory);
        let del = await imgUp.deleteLocalFile(file);
        let folderDirectory = s3Path.folder;
        if(folderDirectory === 'reviews'){
            console.log("reviews");
            //let reviewMongo = await reviewModel.reviewImgMongo(s3Path); //로그인 정보로 가장 최신
        }
        res.send(s3Path);
    } catch(error){
        console.log(error);
        res.status(error.code).send({msg:"imgUpload Error"});
    }
}

async function writeReview(req, res) {
    try{
        let reviewData = await reviewModel.sendReview(req);
        conn.connect(); // 코드 합친 후 빼줄 것
        let writeReview = await reviewModel.writeReview(reviewData);
        let addMyReview = await reviewModel.addMyReview(reviewData); // 몽고 user collection schema 정의 후 내가 쓴 리뷰에 추가
        console.log(addMyReview);
        conn.disconnect(); // 코드 합친 후 빼줄 것
        res.send(writeReview);
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