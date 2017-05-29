const express = require('express');
const reviewModel = require('../model/reviewModel');

var router = express.Router();

router.route('/reviews')
    .get(showReviews);

async function showReviews(req, res) {
    try{

    } catch( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

module.exports = router;