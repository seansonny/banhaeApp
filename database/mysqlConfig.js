const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'practice',
    'username', // 유저 명
    'password', // 비밀번호
    {
        'host': 'localhost', // 데이터베이스 호스트
        'dialect': 'mysql' // 사용할 데이터베이스 종류
    }
);