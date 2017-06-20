const Sequelize = require('sequelize');
const sequelize = require('../../dbConnections/mysqlConfig');

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

//대표견 변경
PetModel.changeMainPet = function (mainPet) {
    return new Promise((resolve,reject)=> {
        PetModel.update({main_pet: 1}, {
            where: {pet_id: mainPet}
        }).then(()=> {
            resolve();
        }).catch(()=> {
            reject(err);
        })
    });
}

//펫 주요 정보보기(pet_age, pet_weight, pet_gender)
PetModel.getSimplePetByID = function(pet_id) {
    return new Promise((resolve,reject)=> {
        PetModel.find({
            where: {pet_id:pet_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//유저 아이디로 대표견의 주요 정보 보기
PetModel.getSimplePetByUser = function(user_id) {
    return new Promise((resolve,reject)=> {
        PetModel.find({where: {
            user_id:user_id,
            main_pet:2
        }})
            .then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

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
PetModel.getPetList = function(user_id) {
    return new Promise((resolve,reject)=> {
        PetModel.findAndCount({where:{user_id:user_id}}, {attributes:['name','image_url','gender','weight','birthday','type','pet_id', 'main_pet']}).then((results) => {
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
            image_url: null,
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
PetModel.addPet = function(body,user,main_pet) {
console.log('PetModel.addPet :', body);
    return new Promise((resolve,reject)=> {
        PetModel.create({
            name: body.name  //필수
            , type: body.type  //필수
            , gender: parseInt(body.gender)  //필수
            , birthday: body.birthday  //필수
            , weight: parseFloat(body.weight)
            , allergy: body.allergy
            , remark: body.remark
            , special: body.special
            , main_pet: parseInt(main_pet)  //필수
            , user_id: user.email  //필수
            , image_url: null
            , image_key: null
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
            console.log(err);
        });
    });
}

//펫 정보 수정
PetModel.updatePet = function(pet_id,body,mainPet) {
    return new Promise((resolve,reject)=> {
        PetModel.update({
                    name: body.name  //필수
                    , type: body.type  //필수
                    , gender: body.gender  //필수
                    , birthday: body.birthday  //필수
                    , weight: body.weight
                    , allergy: body.allergy
                    , remark: body.remark
                    , special: body.special
                    , main_pet: mainPet  //필수
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
