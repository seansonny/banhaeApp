const Sequelize = require('sequelize');
const seq = require('../../dbConnections/mysqlConfig');

let RequestModel = seq.define('requests', {
    request_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true}
    , user_id: {type: Sequelize.STRING, references:{model:'../../etc/usersModel', key:'user_id'}}
    , category: {type: Sequelize.INTEGER}
    , request: {type: Sequelize.TEXT}
    , feed_name: {type: Sequelize.TEXT, allowNull: true}
}, {
    timestamps: false
});

//질문 목록 가져오기
RequestModel.getRequestList = function() {
    return new Promise((resolve,reject)=> {
        RequestModel.findAndCount().then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//질문하기
RequestModel.addRequest = function(req) {
    return new Promise((resolve,reject)=> {
        let intCategory = req.body.category;
        RequestModel.create({
            user_id: req.user.email,
            category: parseInt(intCategory),
            request: req.body.request,
            feed_name: req.body.feed_name
            }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    })
};

//질문 삭제
RequestModel.deleteRequest = function(request_id) {
    return new Promise((resolve,reject)=> {
        RequestModel.destroy({
            where: {request_id: request_id}

        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = RequestModel;