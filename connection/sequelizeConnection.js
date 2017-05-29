const Sequelize = require('sequelize');
let seq = new Sequelize(
    'BAANHAE',
    'rdbadmin',
    'qksgoqksgo123',
    {
        'host' : 'banhaerdb.cpu3j20dvqwu.ap-northeast-2.rds.amazonaws.com',
        'dialect': 'mysql'
    }
);

module.exports = seq;