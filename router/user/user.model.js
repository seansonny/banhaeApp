var seq = require('../../dbConnections/sequelizeConnection');
var Sequelize = require('sequelize');
var UserSchema = require('../../database/mongoUserSchema');

class Model {
}
// 모델 만들기 (자바스크립트 객체와 DB 테이블을 매핑)
let Users = seq.define('users', {
    user_id : {type: Sequelize.STRING(255), primaryKey: true},
    nickname : {type: Sequelize.STRING(128), allowNull: true},
    pw : {type: Sequelize.STRING(128)},
    gender : {type: Sequelize.INTEGER},
    birthday : {type: Sequelize.INTEGER},
    salt : {type: Sequelize.INTEGER,}},
    {timestamps: false}
);

//// 모든 오퍼레이션은 bluebird를 기반으로 한 Promise를 리턴한다.

Model.addUser = function(user_info){

    return new Promise((resolve, reject) =>{
        console.log("addUser", user_info);
        try{
            Users.create({
                user_id: user_info.email,
                nickname: user_info.nickname,
                pw: user_info.pw,
                gender: user_info.gender,
                birthday: user_info.birthday,
                salt: user_info.salt
            });

            resolve("success");
        }catch( error ){
            console.log(error);
            reject("User Insertion is Rejected");
        }

    });

};

Model.addMongoUser = function(user_info){
    return new Promise((resolve, reject) =>{
        try{
            let mongoUser = new UserSchema();
            mongoUser.email = user_info.email;

            let result = mongoUser.save();
            resolve("success");
        }catch( error ){
            console.log(error);
            reject();
        }
    })
};

Model.isUniqueEmail = function(email){
    return new Promise((resolve, reject)=>{
        try{
            Users.count({where: {user_id: email}}).then((count) => {
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

Model.loginUser = function(user_email){

    return new Promise((resolve, reject) => {
        try{
            Users.findOne({where: {user_id: user_email}}).then(user => {
                const user1 = user.dataValues;
                const userData = {
                    user_id: user1.user_id,
                    pw: user1.pw,
                    gender:user1.gender,
                    salt: user1.salt,
                    nickname: user1.nickname
                };
                resolve({msg:"success", data:userData});
            });

        }catch ( error ){
            console.log(error);
            reject("이메일, 비밀번호 다시 확인");
        }
    });
};

Model.showUser = function(user_email){

    return new Promise((resolve, reject) => {
        try{
            Users.findOne({where: {user_id: user_email}}).then(user => {
                const user1 = user.dataValues;
                const userData = {
                    user_id: user1.user_id,
                    nickname: user1.nickname,
                    gender: user1.gender,
                    birthday:user1.birthday
                };
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

        try{
            Users.update({nickname: nickname, pw: pw, salt: salt},
            {where: {token: token}});
            resolve({msg:"success"});
        }catch ( error ){
            reject("editUser rejected");
        }
    });
};

module.exports = Model;