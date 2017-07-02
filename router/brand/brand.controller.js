const express = require('express');
const BrandModel = require('./brand.model');
const BrandCmpModel = require('./brand_cmp.model');
const FeedModel = require('../feed/feed.model');
const router = express.Router();

router.get('/search', getBrandByName);  //브랜드 검색용
router.get('/list', getBrandList);  //브랜드 목록 가져오기
router.get('/:brand_id', getBrandByID);  //브랜드 상세보기
router.get('/compare/:brand_id', getBrandByID_cmp);  //브랜드 비교하기용
router.post('/', addBrand); //브랜드 추가하기
router.put('/:brand_id', updateBrand); //브랜드 수정하기
router.delete('/:brand_id', deleteBrand); //브랜드 삭제하기

async function getBrandByID_cmp(req, res) {
    try {
        let brand_id = req.params.brand_id;
        if(!brand_id) {
            res.status(400).send({"msg":"No Brand ID!!"})
            return;
        }
        const brand = await BrandCmpModel.getBrandByID_cmp(brand_id);
        let result = { data:brand, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function getBrandList(req, res) {
    try {
        const brand = await BrandModel.getBrandList();
        const feed = await FeedModel.getFeedList();
        let data = [];

        for(let i=0;i<brand.count+feed.count;i++) {
            if(i<brand.count) {
                data[i] = {NAME:brand.rows[i].name};
            }
            else {
                data[i] = feed.feed[i-brand.count];
            }
        }

        let result = { data:data, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function getBrandByName(req, res) {
    try {
        // 요청값 체크
        let brand_name = req.query;
        if(brand_name.keyword.length == 0) {
            res.status(400).send({"msg":"No Brand Name!!"});
            return;
        }
        //Model 접근
        const brand = await BrandModel.getBrandByName(brand_name);
        //brand name 길이순으로 정렬 후 클라이언트 응답
        if(brand.length >= 2) {
            brand.sort(function (a,b) {
                return a.name.length < b.name.length ? -1 : a.name.length > b.name.length ? 1 : 0;
            });
        }
        let result = { data:brand, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function getBrandByID(req, res) {
    try {
        let brand_id = req.params.brand_id;
        if(!brand_id) {
            res.status(400).send({"msg":"No Brand ID!!"})
            return;
        }
        const brand = await BrandModel.getBrandByID(brand_id);
        let result = { data:brand, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function addBrand(req, res) {
    try {
        //입력 처리
        const brand = await BrandModel.addBrand();
        let result = { data:brand, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function updateBrand(req, res) {
    try {
        let brand_id = req.params.brand_id;
        if(!brand_id) {
            res.status(400).send({"msg":"No Brand ID!!"})
            return;
        }

        const brand = await BrandModel.updateBrand(brand_id);
        let result = { data:brand, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function deleteBrand(req, res) {
    try {
        let brand_id = req.params.brand_id;
        if(!brand_id) {
            res.status(400).send({"msg":"No Brand ID!!"})
            return;
        }

        const brand = await BrandModel.deleteBrand(brand_id);
        let result = { data:brand, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

module.exports = router;