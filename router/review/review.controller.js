const express = require('express');
const reviewModel = require('./review.model');
const imgUp = require('../../model/imgUpload');
const FeedModel = require('../feed/feed.model');
const multer = require('multer');
const upload = multer({
    dest : 'tmp'
});

var router = express.Router();

router.route('/likes')
    .post(likeReview);

router.route('/')
    .get(showReviews);

router.route('/myReviews')
    .get(showMyReviews);

router.route('/:review_id')
    .delete(deleteReview);

router.post('/', upload.any(), writeReview);

async function writeReview(req, res) {
    try{
        let file=req.files[0];
        let s3Path = {url: "https://s3.ap-northeast-2.amazonaws.com/banhaebucket/defalutPetImage.png", itemKey:"defalutPetImage.png"};
        if (file != undefined){
            file = req.files[0];
            let sizeTest = await imgUp.sizeTest(file);
            let ratio = 2;
            let width = sizeTest.data.width/ratio;
            let height = sizeTest.data.height/ratio;
            let resized = await imgUp.resizingImg(file, width, height);
            let directory = 'reviews';
            s3Path = await imgUp.s3Upload(file, directory); //s3Path.url ,s3Path.folder
        }// 사진 사이즈에 맞게 비율로 조정, 리뷰에 맞는 사이즈 받기

        let reviewData = await reviewModel.sendReview(req, s3Path);
        let writeReview = await reviewModel.writeReview(reviewData);
        await reviewModel.addMyReview(reviewData); // 몽고 user collection schema 정의 후 내가 쓴 리뷰에 추가
        //사료 콜렉션에 있는 Review_Num 컬럼 변경
        await FeedModel.updateReviewNum(reviewData.feed_id, 0);  //0이면 증가, 1이면 감소

        res.send({msg:"success", data: writeReview});
    } catch( error ){
        console.log(error);
        res.status(error.code).send({msg:error.msg});
    } finally {
        await imgUp.deleteLocalFile(file);
    }
}

async function showMyReviews(req, res){
    try{
        let myReviews = await reviewModel.showMyReviews(req);
        res.send(myReviews);
    }catch (error){
        res.status(error.code).send({msg:error.msg});
    }
}

async function likeReview(req, res) {
    try{
        let review = await reviewModel.addLikedUsers(req);
        res.send(review);
    }catch(error){
        res.status(error.code).send({msg:error.msg});
    }
}

async function showReviews(req, res) {
    try{
        /*let showLatestReviews = await reviewModel.showLatestReviews();*/  //review_objId도 보내줘야함(보류)
        let tempReviews = [];
        let sort = req.query.sort;
        let mode = req.query.type;
        let page = req.query.page;

        //최신순(디폴트값)
        let reviews = await reviewModel.showLatestReviews();

        if(sort == "like") {
            //좋아요순(like_users을 세야하나? 집계함수로 ㄱㄱ)
            reviews = await reviewModel.showMostLikeReviews();
        }

        if(mode != 'all') {  //개 이름값이 정확히 오면
            for(let i=0;i<reviews.length;i++) {
                if(reviews[i].pet_type == mode) {
                    tempReviews.push(reviews[i]);
                }
            }
            reviews = tempReviews;
            tempReviews = [];
        }
        
        //page처리
        for(let i=(page-1)*5;i<(5*page);i++) {
            if(reviews[i] == null) {
                break;
            }
            tempReviews.push(reviews[i]);
        }

        reviews = tempReviews;

        res.send(reviews);
    } catch(err){
        res.send({msg:err.msg});
    }
}

async function deleteReview(req, res) {

    try{
        let review_id = req.params.review_id;
        let reviewData = await reviewModel.deleteReview(review_id);

        imgUp.deleteS3(reviewData[0].img_key); //사진 삭제
        let deleteResult = await reviewModel.deleteMyReview(review_id); //디비 삭제
        //사료 콜렉션에 있는 Review_Num 컬럼 변경
        await FeedModel.updateReviewNum(reviewData[0].feed_id, 1);  //0이면 증가, 1이면 감소
        res.send(deleteResult);
    } catch( error ){
        console.log(error);
        res.status(error.code).send({msg:error.msg});
    }
}

module.exports = router;
