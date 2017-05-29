const express = require('express');
const reviewModel = require('../model/reviewModel');
const conn = require('../connection/mongooseConnection');

var router = express.Router();

router.route('/reviews')
    .post(writeReview);

router.route('/reviews/:review_id')
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
        conn.disconnect();
        res.send(writeReview);
    } catch( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

function likeReview() {

}

function showReviews() {

}

function deleteReview() {

}

module.exports = router;