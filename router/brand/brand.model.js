const Sequelize = require('sequelize');
const sequelize = require('../../dbConnections/mysqlConfig');

let BrandModel = sequelize.define('brand', {
    brand_id: {type: Sequelize.INTEGER, primaryKey: true}
    , name: {type: Sequelize.STRING}
    , company: {type: Sequelize.TEXT, allowNull: true}
    , facility: {type: Sequelize.TEXT, allowNull: true}
    , research: {type: Sequelize.STRING, allowNull: true}
    , is_recall: {type: Sequelize.BOOLEAN, allowNull: true}
    , recipe: {type: Sequelize.STRING, allowNull: true}
    , foundation: {type: Sequelize.STRING, allowNull: true}
    , recall: {type: Sequelize.TEXT, allowNull: true}
    , image_url: {type: Sequelize.STRING}
}, {
        timestamps: false
});

//브랜드 검색
BrandModel.getBrandByName = function(brand_name) {
    return new Promise((resolve,reject)=> {
        BrandModel.findAll({
            where: {$or: [
                {name: {like: "%"+brand_name.keyword+"%"}},
                {name_en: {like: "%"+brand_name.keyword+"%"}},
                {name_ab: {like: "%"+brand_name.keyword+"%"}}
                ]}})
            .then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//브랜드 상세 정보보기
BrandModel.getBrandByID = function(brand_id) {
    return new Promise((resolve,reject)=> {
        BrandModel.findOne({
            where: {brand_id:brand_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//브랜드 목록 가져오기
BrandModel.getBrandList = function() {
    return new Promise((resolve,reject)=> {
        BrandModel.findAndCount({attributes:['name']}).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//브랜드 정보추가
BrandModel.addBrand = function() {
    return new Promise((resolve,reject)=> {
        BrandModel.create({
            brand_id: 95,
            name: "오리젠",
            company: "Champion Petfoods는 2017년 기준으로 26년이 된 기업이며 오리젠과, 아카나 두개의 브랜드를 소유하고 있습니다.",
            facility: "자체 생산 시설(champion petfoods)을 가지고 있습니다.(9503 90 Ave, Morinville, AB T8R 1K7 캐나다, Champion Petfoods NorthStar® Kitchens)",
            research: "자체 연구시설을 보유하고 있습니다.(BAFRINO Research and Innovation Centre)",
            is_recall: 1,
            recipe: "회사 자체 레서피를 보유하고 있습니다.",
            foundation: "2006년",
            recall: "2008년 11월 필수 감사 조사에 문제가 발생해서 호주의 오리젠 고양이 사료만 리콜 진행",
            image_url:null
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//브랜드 정보수정
BrandModel.updateBrand = function(brand_id) {
    return new Promise((resolve,reject)=> {
        BrandModel.update({
            recall: "수정완료"
        }, {
            where: {brand_id: brand_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//브랜드 정보삭제
BrandModel.deleteBrand = function(brand_id) {
    return new Promise((resolve,reject)=> {
        BrandModel.destroy({
            where: {brand_id: brand_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = BrandModel;