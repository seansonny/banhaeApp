var sequel = require('./sequelizeConnection');
var Sequelize = require('sequelize');

// 모델 만들기 (자바스크립트 객체와 DB 테이블을 매핑)

class UserModel {
}

sequel.define('Users', {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    nickname : {
        type: Sequelize.STRING(16),
    },
    pw : {
        type: Sequelize.STRING(32)
    },
    gender : {
        type: Sequelize.INTEGER,
        allowNull: true,
    },

    birthday : {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    token : {
        type: Sequelize.STRING(45),
        allowNull: true,
    }
});

//// 모든 오퍼레이션은 bluebird를 기반으로 한 Promise를 리턴한다.
UserModel.addUser = function(user_info){

    return new Promise((resolve, reject) =>{
        const gender = user_info.gender;
        const birth = user_info.birth;
        const token = user_info.token; //토큰 로직 필요

        try{
            Users.create({
                user_id: user_info.user_id,
                nickname: user_info.nickname,
                pw: user_info.pw,
                gender: gender,
                birthday: birth,
                token: token
            });

            console.log("호출??");
            resolve("Success");
        }catch( error ){
            console.log(error);
            reject("Rejected");
        }

    });

}

module.exports = UserModel;