const Sequelize = require('sequelize');
const sequelize = require('../../database/mysqlConfig');

let PetModel = sequelize.define('pet', {
    pet_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
    , name: {type: Sequelize.STRING, allowNull: true}
    , type: {type: Sequelize.STRING, allowNull: true}
    , gender: {type: Sequelize.INTEGER}
    , birthday: {type: Sequelize.STRING}
    , weight: {type: Sequelize.INTEGER}
    , allergy: {type: Sequelize.TEXT}  //아마 배열..?
    , remark: {type: Sequelize.STRING}
    , special: {type: Sequelize.TEXT}
    , main_pet: {type: Sequelize.INTEGER}
    , user_id: {type: Sequelize.STRING, references:{model:'../user/user.model', key:'user_id'}}  // 외래키 이렇게 맞나??
    , image_key: {type: Sequelize.TEXT}
    , image_url: {type: Sequelize.TEXT}
}, {
    timestamps: false
});

//펫 상세 정보보기
PetModel.getPetByID = function(pet_id) {
    return new Promise((resolve,reject)=> {
        PetModel.findOne({
            where: {pet_id:pet_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//펫 목록 가져오기
PetModel.getPetList = function() {
    return new Promise((resolve,reject)=> {
        PetModel.findAndCount({attributes:['name','image_url']}).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//펫 사진 추가
PetModel.uploadPetImg = function(pet_id, itemKey, img_url) {
    return new Promise((resolve,reject)=> {
        PetModel.update({
            image_url:img_url,
            image_key: itemKey
        }, {
            where: {pet_id: pet_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//펫 정보 가져오기
PetModel.getPetImg = function(pet_id) {
    return new Promise((resolve,reject)=> {
        PetModel.findOne({
            where: {pet_id:pet_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//펫 사진 삭제
PetModel.deletePetImg = function(pet_id) {
    return new Promise((resolve,reject)=> {
        PetModel.update({
            image_url: "https://s3.ap-northeast-2.amazonaws.com/banhaebucket/defalutPetImage.png",
            image_key: null
        }, {
            where: {pet_id: pet_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//펫 정보 추가
PetModel.addPet = function() {
    return new Promise((resolve,reject)=> {
        PetModel.create({
            name: "뿡뿡이"
            , type: "시바견"
            , gender: 0
            , birthday: "2017-05-30"
            , weight: 10
            , allergy: "1;2;3"
            , remark: "없음"
            , special: "없음"
            , main_pet: 1
            , user_id: "ddkkd1"
            , image_url: "https://s3.ap-northeast-2.amazonaws.com/banhaebucket/defalutPetImage.png"
            , image_key: null
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//펫 정보 수정
PetModel.updatePet = function(pet_id) {
    return new Promise((resolve,reject)=> {
        PetModel.update({
            remark: "임신중"
        }, {
            where: {pet_id: pet_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//펫 정보삭제
PetModel.deletePet= function(pet_id) {
    return new Promise((resolve,reject)=> {
        PetModel.destroy({
            where: {pet_id: pet_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = PetModel;