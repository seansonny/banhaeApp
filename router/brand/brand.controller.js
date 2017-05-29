const express = require('express');
const BrandModel = require('./brand.model');
const router = express.Router();

router.get('/search', getBrandByName);  //브랜드 검색용
router.get('/:brand_id', getBrandByID);  //브랜드 상세보기
router.post('/', addBrand); //브랜드 추가하기
router.put('/:brand_id', updateBrand); //브랜드 수정하기
router.delete('/:brand_id', deleteBrand); //브랜드 삭제하기
/*router.get('/', getBrandList);  //브랜드 목록 가져오기*/

async function getBrandByName(req, res) {
    try {
        // 요청값 체크
        let brand_name = req.query;
        if(brand_name.keyword.length == 0) {
            res.send({"msg":"No Brand Name!!"});
        }
        //Model접근
        const brand = await BrandModel.getBrandByName(brand_name);
        //기타 처리 후 클라이언트 응답
        let result = { data:brand, msg:"getBrandByName 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function getBrandByID(req, res) {
    try {
        let brand_id = req.params.brand_id;
        if(!brand_id) {
            res.send({"msg":"No Brand ID!!"})
        }
        const brand = await BrandModel.getBrandByID(brand_id);
        let result = { data:brand, msg:"getBrandByID 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function addBrand(req, res) {
    try {
        //입력 처리
        const brand = await BrandModel.addBrand();
        let result = { data:brand, msg:"addBrand 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function updateBrand(req, res) {
    try {
        let brand_id = req.params.brand_id;
        if(!brand_id) {
            res.send({"msg":"No Brand ID!!"})
        }

        const brand = await BrandModel.updateBrand(brand_id);
        let result = { data:brand, msg:"updateBrand 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function deleteBrand(req, res) {
    try {
        let brand_id = req.params.brand_id;
        if(!brand_id) {
            res.send({"msg":"No Brand ID!!"})
        }

        const brand = await BrandModel.deleteBrand(brand_id);
        let result = { data:brand, msg:"deleteBrand 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

module.exports = router;