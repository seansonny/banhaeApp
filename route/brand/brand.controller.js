const express = require('express');
const brandModel = require('./brand.model.js');

//검색할 때 사용할 예정(추후에 like 처리)
exports.showBrands = function(req, res, next) {
    let brand_name = req.query;

    brandModel.findOne({
        where: {name:brand_name.keyword}
    }).then((brands) => {
        res.json(brands);
    }).catch(function (err) {
        res.send(err);
    });
}

//브랜드 상세 정보보기
exports.showBrand = function(req, res, next) {
    let brand_id = req.params.brand_id;

    brandModel.findOne({
        where: {brand_id:brand_id}
    }).then((results) => {
        res.json(results);
    }).catch(function (err) {
        res.send(err);
    });
}

//브랜드 정보추가
exports.addBrand = function(req, res, next) {
    brandModel.create({
        brand_id:95,
        name:"오리젠",
        company:"Champion Petfoods는 2017년 기준으로 26년이 된 기업이며 오리젠과, 아카나 두개의 브랜드를 소유하고 있습니다.",
        facility:"자체 생산 시설(champion petfoods)을 가지고 있습니다.(9503 90 Ave, Morinville, AB T8R 1K7 캐나다, Champion Petfoods NorthStar® Kitchens)",
        research:"자체 연구시설을 보유하고 있습니다.(BAFRINO Research and Innovation Centre)",
        is_recall:1,
        recipe:"회사 자체 레서피를 보유하고 있습니다.",
        foundation:"2006년",
        recall:"2008년 11월 필수 감사 조사에 문제가 발생해서 호주의 오리젠 고양이 사료만 리콜 진행"
    }).then((results) => {
        res.json(results);
    }).catch(function (err) {
        res.send(err);
    });
}

//브랜드 정보수정
exports.updateBrand = function(req, res, next) {
    let brand_id = req.params.brand_id;

    brandModel.update({
        recall:"NO"
    }, {
        where: {brand_id:brand_id}
}).then((results) => {
        res.json(results);
    }).catch(function (err) {
        res.send(err);
    });
}

//브랜드 정보삭제
exports.deleteBrand = function(req, res, next) {
    let brand_id = req.params.brand_id;

    brandModel.destroy({
        where: {brand_id:brand_id}
    }).then((results) => {
        res.json(results);
    }).catch(function (err) {
        res.send(err);
    });
}