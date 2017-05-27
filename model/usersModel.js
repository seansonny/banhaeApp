var sequel = require('./sequelizeConnection');
var Sequelize = require('sequelize');


class UserModel {
}
// 모델 만들기 (자바스크립트 객체와 DB 테이블을 매핑)
let Users = sequel.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    email : {
        type: Sequelize.STRING(32)
    },
    nickname : {
        type: Sequelize.STRING(16),
        allowNull: true
    },
    pw : {
        type: Sequelize.STRING(32)
    },
    gender : {
        type: Sequelize.INTEGER,
    },

    birthday : {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    token : {
        type: Sequelize.STRING(45),
        allowNull: true,
    }},
    {
        timestamps: false
    }
);

//// 모든 오퍼레이션은 bluebird를 기반으로 한 Promise를 리턴한다.
UserModel.addUser = function(user_info){

    return new Promise((resolve, reject) =>{
        const gender = user_info.gender;
        const birth = user_info.birth;
        const token = user_info.token; //토큰 로직 필요
        try{
            Users.create({
                email: user_info.email,
                nickname: user_info.nickname,
                pw: user_info.pw,
                gender: gender,
                birthday: birth,
                token: token
            });

            resolve("Success");
        }catch( error ){
            console.log(error);
            reject("Rejected");
        }

    });

}

module.exports = UserModel;