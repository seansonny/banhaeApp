var seq = require('../connection/sequelizeConnection');
var Sequelize = require('sequelize');
//const UserValidation = require('../validation/usersValidation');

class Model {
}
// 모델 만들기 (자바스크립트 객체와 DB 테이블을 매핑)
let Users = seq.define('users', {
    user_id: {type: Sequelize.INTEGER, primaryKey: true,},
    email : {type: Sequelize.STRING(32)},
    nickname : {type: Sequelize.STRING(16), allowNull: true},
    pw : {type: Sequelize.STRING(128)},
    gender : {type: Sequelize.INTEGER,},
    birthday : {type: Sequelize.INTEGER, allowNull: true,},
    token : {type: Sequelize.STRING(45), allowNull: true,},
    salt : {type: Sequelize.INTEGER,}},
    {timestamps: false}
);

//// 모든 오퍼레이션은 bluebird를 기반으로 한 Promise를 리턴한다.
Model.addUser = function(user_info){

    return new Promise((resolve, reject) =>{
        const gender = user_info.gender;
        const birth = user_info.birth;
        const token = user_info.token; //토큰 로직 필요
        const salt = user_info.salt;
        try{
            Users.create({
                email: user_info.email,
                nickname: user_info.nickname,
                pw: user_info.pw,
                gender: gender,
                birthday: birth,
                token: token,
                salt: salt
            });

            resolve(true);
        }catch( error ){
            console.log(error);
            reject("User Insertion is Rejected");
        }

    });

};

Model.isUniqueEmail = function(email){
    return new Promise((resolve, reject)=>{
        try{
            Users.count({where: {email: email}}).then(count=>{
                resolve(count);
            })
        }catch ( error ){
            reject(error);
        }
    })
};

Model.isUniqueNickname = function(nickName){
    return new Promise((resolve, reject)=>{
        try{
            Users.count({where: {nickname: nickName}}).then(count=>{
                resolve(count);
            })
        }catch ( error ){
            reject(error);
        }
    })
};

Model.showUser = function(user_token){

    return new Promise((resolve, reject) => {
        try{
            Users.findOne({where: {token: user_token}}).then(user => {
                const user1 = user.dataValues;
                const userData = {
                    email: user1.email,
                    nickname: user1.nickname,
                    gender: user1.gender,
                    birth:user1.birthday
                };
                //console.log(userData);
                resolve({msg:"success", data:userData});
            });

        }catch ( error ){
            console.log(error);
            reject("findOne rejected");
        }
    });
};

Model.deleteUser = function(user_token){

    return new Promise((resolve, reject) =>{
        try{
            Users.destroy({where: {token:user_token}});
            resolve({msg:"success"});
        }catch(error){
            console.log(error);
            reject("destroy rejected");
        }
    });
};

Model.editUser = function (pw_info, req, token) {

    return new Promise((resolve, reject) =>{
        let nickname = req.body.nickname;
        let pw = pw_info.hash;
        let salt = pw_info.salt;

        // let token2 = UserValidation.userToken;
        // console.log("t " + token2);
        try{
            Users.update({nickname: nickname, pw: pw, salt: salt},
            {where: {token: token}});
               // {token: token});
            resolve({msg:"success"});
        }catch ( error ){
            reject("editUser rejected");
        }
    });
};

module.exports = Model;