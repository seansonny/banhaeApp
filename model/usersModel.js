var seq = require('../connection/sequelizeConnection');
var Sequelize = require('sequelize');


class Model {
}
// 모델 만들기 (자바스크립트 객체와 DB 테이블을 매핑)
let Users = seq.define('users', {
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
        type: Sequelize.STRING(128)
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
    },
    salt : {
        type: Sequelize.INTEGER,
    }},
    {
        timestamps: false
    }
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

            resolve("User is Successfully inserted");
        }catch( error ){
            console.log(error);
            reject("User Insertion is Rejected");
        }

    });

}

module.exports = Model;