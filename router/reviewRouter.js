const express = require('express');
const reviewModel = require('../model/reviewModel');
const conn = require('../connection/mongooseConnection');

var router = express.Router();

router.route('/reviews')
    .post(writeReview);

router.route('/reviews/likes')//이거 수정 필요 post 방식으로 처리
    .post(likeReview);

router.route('/reviews')
    .get(showReviews);

router.route('/reviews/:review_id')
    .delete(deleteReview);


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
    //그냥 숫자만 올라감
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
    //내 리뷰인지 session/token 확인후
    //review_id params로 삭제
}

module.exports = router;