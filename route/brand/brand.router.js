const express = require('express');
const ctrl = require('./brand.controller');
const router = express.Router();

router.get('/',ctrl.showBrands);  //브랜드 목록보기
router.get('/:brand_id',ctrl.showBrand);  //브랜드 상세보기
router.post('/',ctrl.addBrand); //브랜드 추가하기
router.put('/:brand_id',ctrl.updateBrand); //브랜드 수정하기
router.delete('/:brand_id',ctrl.deleteBrand); //브랜드 삭제하기

module.exports = router;