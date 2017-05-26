const Seqeulize = require('sequelize');
const sequelize = new Sequelize(
    'BAANHAE',
    'rdbadmin',
    'qksgoqksgo123',
    {
        'host' : 'banhaerdb.cpu3j20dvqwu.ap-northeast-2.rds.amazonaws.com',
        'dialect': 'mysql' // 사용할 데이터베이스 종류
    }
);