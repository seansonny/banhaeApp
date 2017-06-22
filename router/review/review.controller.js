const express = require('express');
const reviewModel = require('./review.model');
const FeedModel = require('../feed/feed.model');
const PetModel = require('../pet/pet.model');
const UserModel = require('../user/user.model');
const UserValidation = require('../user/usersValidation');
const imgUp = require('../../etc/imgUpload');
const auth = require('../user/auth');
const multer = require('multer');
const upload = multer({
    dest : 'tmp'
});

let router = express.Router();

router.get('/', showReviews);                         //리뷰보기
router.get('/feed/:feed_id', showFeedReviews);        //특정 사료 리뷰보기
router.delete('/:review_id', auth.isAuthenticated(), deleteReview);           //리뷰 삭제하기
router.post('/', upload.any(), auth.isAuthenticated(), writeReview);                //리뷰추가하기
router.post('/likes',auth.isAuthenticated(), likeReview);                //공감
router.get('/myReviews',auth.isAuthenticated(), showMyReviews);              //내가 쓴 리뷰보기

async function writeReview(req, res) {
    try{
        let s3Path = {url: null, itemKey:null};
        if (req.files && req.files !== undefined && req.files[0] && req.files[0] !== undefined){
            let file = req.files[0];
            let sizeTest = await imgUp.sizeTest(file);
            let ratio = 2;
            let width = sizeTest.data.width/ratio;
            let height = sizeTest.data.height/ratio;
            let resized = await imgUp.resizingImg(file, width, height);
            let directory = 'reviews';
            s3Path = await imgUp.s3Upload(file, directory); //s3Path.url ,s3Path.folder
        }// 사진 사이즈에 맞게 비율로 조정, 리뷰에 맞는 사이즈 받기

        let petInfo = await PetModel.getSimplePetByUser(req.user.email);
        let reviewData = await reviewModel.sendReview(req, s3Path, petInfo, req.body.feed_id);
        let writeReview = await reviewModel.writeReview(reviewData);
        await reviewModel.addMyReview(req.user.email, reviewData); // 몽고 user collection schema 정의 후 내가 쓴 리뷰에 추가

        let  feedData = await FeedModel.getFeedByIndex(reviewData.feed_index);

        await FeedModel.updateRating(feedData,reviewData); // 사료 별점 수정
        await FeedModel.updateReviewNum(reviewData.feed_index, 0);  //0이면 증가, 1이면 감소

        res.send({msg:"success", data: writeReview});
    } catch( error ){
        console.log(error);
        res.status(500).send({msg:error});
    } finally {
        if (req.files && req.files !== undefined && req.files[0] && req.files[0] !== undefined){
            await imgUp.deleteLocalFile(req.files[0]);
         }
    }
}

async function showMyReviews(req, res){
    try{
        let reviews = await reviewModel.showMyReviews(req);
        let page = req.query.page;
        let myReviews = await additionalInfo(req.user.email, reviews, page);

        res.send(myReviews);
    }catch (error){
        res.status(error.code).send({msg:error.msg});
    }
}

async function likeReview(req, res) {
    try{
        let likeUsers = await reviewModel.getLikeUsers(req);
        let likeFlag = await reviewModel.isLikeUsers(likeUsers.like_users, req.user.email);
        let likeReview = await reviewModel.addLikedUsers(req, likeFlag);
        res.send(likeReview);
    }catch(err){
        console.log(err);
        res.send({msg:err.msg});
    }
}

async function showReviews(req, res) {
    let user_email = "비회원";
    if (req.cookies.token !== null && req.cookies.token !== undefined){
        user_email = await UserValidation.jwtVerification(req);
    }
    console.log("showReviews 호출 id: ",user_email);

    try{
        let tempReviews = []; //몽고 디비에서
        let sort = req.query.sort;
        let petType = req.query.type;
        let page = req.query.page;

        //최신순(디폴트값)
        let reviews = await reviewModel.showLatestReviews();

        if(sort === "like") {
            //좋아요순
            reviews = await reviewModel.showMostLikeReviews();
        }

        if(petType !== 'all') {  //개 이름값이 정확히 오면
            for(let i=0;i<reviews.length;i++) {
                if(reviews[i].pet_type === petType) {
                    tempReviews.push(reviews[i]);
                }
            }
            reviews = tempReviews;
        }

        let showReviews = await additionalInfo(user_email, reviews, page);
        res.send(showReviews);
    } catch(err){
        res.send({msg:err.msg});
    }
}

//사료에 들어가서 리뷰볼 때 사용
async function showFeedReviews(req, res) {
    try{
        let user_email = "비회원";
        if (req.cookies.token !== null && req.cookies.token !== undefined){
            user_email = await UserValidation.jwtVerification(req);
        }
        console.log("showReviews 호출 id: ",user_email);

        let page = req.query.page;
        //최신순(디폴트값)
        let reviews = await reviewModel.showLatestFeedReviews(req.params.feed_id);

        let feedReviews = await additionalInfo(user_email, reviews, page);

        res.send(feedReviews);
    } catch(err){
        res.send({msg:err.msg});
    }
}

async function deleteReview(req, res) {
    try{
        let review_id = req.params.review_id;
        let reviewData = await reviewModel.deleteReview(review_id);

        imgUp.deleteS3(reviewData[0].img_key); //사진 삭제
        let deleteResult = await reviewModel.deleteMyReview(review_id, req.user.email); //디비 삭제
        //사료 콜렉션에 있는 Review_Num 컬럼 변경
        await FeedModel.updateReviewNum(reviewData[0].feed_id, 1);  //0이면 증가, 1이면 감소
        res.send(deleteResult);
    } catch( error ){
        console.log(error);
        res.status(500).send({msg:error});
    }
}

async function additionalInfo(user_email, reviews, page){
    let tempReviews = [];
    for(let i=(page-1)*5;i<(5*page);i++) {
        if(reviews[i] == null) {
            break;
        }
        //tempReviews에 추가하기 전에 나의 LIKE정보, 해당 사료 및 글쓴이 대한 정보 불러오기
        let likeInfo = reviewModel.reviewLikeInfo(user_email, reviews[i]);
        let feedSimpleInfo = await FeedModel.getFeedByIndex(reviews[i].feed_index);
        let userSimpleInfo = await UserModel.showUser(reviews[i].user_id);
        let info = JSON.parse(JSON.stringify(reviews[i]));

        //해당 리뷰의 사료 정보
        info.feed_image = feedSimpleInfo.IMAGE_URL;
        info.feed_name = feedSimpleInfo.NAME;

        //해당 리뷰의 LIKE 정보
        info.like_num = likeInfo.like_num;
        info.my_tastes = likeInfo.myTastes;
        info.user_nickname = userSimpleInfo.data.nickname;

        tempReviews.push(info);
        console.log(info);
    }
    return tempReviews;
}

module.exports = router;
