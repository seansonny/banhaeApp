const express = require('express');
const FeedModel = require('./feed.model');
const router = express.Router();

router.get('/search', getFeedByName); // 사료 검색용
router.get('/list', getFeedList);  //사료 목록 가져오기
router.get('/:feed_id', getFeedByID);  //사료 상세보기
router.post('/', addFeed); //사료 추가하기
router.put('/:feed_id', updateFeed); //사료 수정하기
router.delete('/:feed_id', deleteFeed); //사료 삭제하기

//사료 이름 목록 가져오기
async function getFeedList(req, res) {
    try {
        const feed = await FeedModel.getFeedList();
        let result = {count:feed.length, data:feed, msg:"getFeedList 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function getFeedByName(req, res) {
    try {
        // 요청값 체크
        let feed_name = req.query.keyword;
        let sort = req.query.sort;
        if(!feed_name) {
            res.send({"msg":"No Feed Name!!"})
        }
        //Model접근
        const feed = await FeedModel.getFeedByName(feed_name);
        //기타 처리 후 클라이언트 응답
        //sort 방법에 따라 sorting han, point, review
        if(sort == 'point') {
            //feed을 data로
            //별점순
        } else if(sort == 'review') {
            //리뷰 많은순 이것을 하기 위해선 리뷰 추가 삭제시 카운팅 해줘야함
        } else {
            //가나다순
        }

        let result = { data:data, msg:"getFeedByName 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function getFeedByID(req, res) {
    try {
        let feed_id = req.params.feed_id;
        /*if(!feed_id) {
            res.send({"msg":"No Feed ID!!"});
        }*/

        const feed = await FeedModel.getFeedByID(feed_id);
        let result = { data:feed, msg:"getFeedByID 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function addFeed(req, res) {
    try {
        //입력 처리
        const feed = await FeedModel.addFeed();
        let result = { data:feed, msg:"addFeed 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function updateFeed(req, res) {
    try {
        let feed_id = req.params.feed_id;
        /*if(!feed_id) {
            res.send({"msg":"No Feed ID!!"})
        }*/

        const feed = await FeedModel.updateFeed(feed_id);
        let result = { msg:"updateFeed 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function deleteFeed(req, res) {
    try {
        let feed_id = req.params.feed_id;
       /* if(!feed_id) {
            res.send({"msg":"No Feed ID!!"})
        }*/

        const feed = await FeedModel.deleteFeed(feed_id);
        let result = {msg:"deleteFeed 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function sorting(req, res) {
    try {

        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

module.exports = router;