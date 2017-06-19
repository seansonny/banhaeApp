const express = require('express');
const FeedModel = require('./feed.model');
const FeedSearch = require('./feedSearch');
const countAge = require('../../etc/age');
const auth = require('../user/auth');
const router = express.Router();

router.get('/search', getFeedByName); // 사료 검색용
router.get('/mySearch', auth.isAuthenticated(), getMyFeeds); // 맞춤 검색용
router.get('/list', getFeedList);  //사료 목록 가져오기
router.get('/:feed_id', getFeedByID);  //사료 상세보기
router.post('/', addFeed); //사료 추가하기
router.put('/:feed_id', updateFeed); //사료 수정하기
router.delete('/:feed_id', deleteFeed); //사료 삭제하기

async function getMyFeeds(req, res){
    try{
        const user_id = req.user.email;
        let sort = "가나다 순(기본)";
        if(req.query.sort !== undefined){
            sort= req.query.sort;
        }

        let petInfo = await FeedSearch.getMyPetInfo(user_id);

        const weight = petInfo[0].weight;
        const birthday = petInfo[0].birthday;

        //ALLERGY_LISTS
        const allergy = petInfo[0].allergy.split(';');

        for (let i = 0; i < allergy.length; i++)
            allergy[i] = parseInt(allergy[i]);

        let size = "ALL";
        if(weight < 5){
            size = "소형견";
        }else if(weight < 20){
            size = "중형견";
        }else{
            size = "대형견";
        }

        let targetAge = "ALL";
        if(birthday){
            let age = countAge.countAge(birthday);
            if(age < 1){
                targetAge = "퍼피";
            }else if (age <= 7){
                targetAge = "어덜트";
            }else{
                targetAge = "시니어"
            }
        }

        let type = "주식용";
        if(parseInt(req.query.type) === 2){
            type = "간식용";
        }else if (parseInt(req.query.type) === 3){
            type = "처방식";
        }


        let humidity = "건식";
        if(parseInt(req.query.humidity)=== 1){
            humidity = "건식";
        }else if(parseInt(req.query.humidity)=== 2){
            humidity = "습식";
        }else if(parseInt(req.query.humidity)=== 3){
            humidity = "반습식";
        }

        let priceMin = 0;
        if (req.query.priceMin){
            priceMin = parseFloat(req.query.priceMin);
        }
        let priceMax = 90000000;
        if (req.query.priceMax){
            priceMax = parseFloat(req.query.priceMax);
        }

        const mySearch = {allergy, type, humidity, priceMin, priceMax, size, targetAge};
        let myFeedsSearch = await FeedSearch.myFeedsSearch(mySearch);

        let noAllergy = [];
        for (let i = 0; i < myFeedsSearch.length; i++){
            if (myFeedsSearch[i].allergyCount === 0){
                noAllergy.push(myFeedsSearch[i]);
            }
        }

        let filtered = await feedFilter(noAllergy, sort);
        res.send({"data":filtered});
    }catch(err){
        console.log(err);
        res.status(500).send({msg:err.msg});
    }
}

//사료 이름 목록 가져오기
async function getFeedList(req, res) {
    try {
        const feed = await FeedModel.getFeedList();
        let result = {count:feed.length, data:feed, msg:"getFeedList 성공" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

feedFilter = function(feed, sort){
    return new Promise((resolve, reject)=>{
        if(sort === 'point') {
            feed.sort(function (a,b) {
                return a.RATING < b.RATING ? 1 : a.RATING > b.RATING ? -1 : 0;
            });
            //별점순
        } else if(sort === 'review') {
            //리뷰 많은순
            feed.sort(function (a,b) {
                return a.REVIEW_NUM < b.REVIEW_NUM ? 1 : a.REVIEW_NUM > b.REVIEW_NUM ? -1 : 0;
            });
        } else if(sort === "han"){
            //가나다순
            feed.sort(function (a,b) {
                return a.NAME < b.NAME ? -1 : a.NAME > b.NAME ? 1 : 0;
            });
        } else{
            reject("필터오류");
        }
        console.log("사료검색 ",sort);
        resolve(feed);
    })
}

async function getFeedByName(req, res){
    try{
        // 요청값 체크
        let feed_name = req.query.keyword;
        let sort = "han";
        if(req.query.sort !== undefined){
            sort= req.query.sort;
        }

        if(!feed_name) {
            res.status(400).send({"msg":"No Feed Name!!"})
            return;
        }
        //Model접근
        let feed = await FeedModel.getFeedByName(feed_name);
        //기타 처리 후 클라이언트 응답
        //sort 방법에 따라 sorting han, point, review
        let filtered = await feedFilter(feed, sort);
        let result = { data:filtered, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function getFeedByID(req, res) {
    try {
        let feed_index = req.params.feed_id;
        if(!feed_index) {
            res.status(400).send({"msg":"No Feed ID!!"});
            return;
        }

        const feed = await FeedModel.getFeedByIndex(feed_index);
        let result = { data:feed, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function addFeed(req, res) {
    try {
        //입력 처리
        const feed = await FeedModel.addFeed();
        let result = { data:feed, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function updateFeed(req, res) {
    try {
        let feed_id = req.params.feed_id;
        if(!feed_id) {
            res.status(400).send({"msg":"No Feed ID!!"})
            return;
        }

        const feed = await FeedModel.updateFeed(feed_id);
        let result = { msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function deleteFeed(req, res) {
    try {
        let feed_id = req.params.feed_id;
        if(!feed_id) {
            res.status(400).send({"msg":"No Feed ID!!"})
            return;
        }

        const feed = await FeedModel.deleteFeed(feed_id);
        let result = { msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

module.exports = router;