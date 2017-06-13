const Sequelize = require('sequelize');
const sequelize = require('../../dbConnections/mysqlConfig');

let QuestionModel = sequelize.define('question', {
    question_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true}
    , user_id: {type: Sequelize.STRING, references:{model:'../../etc/usersModel', key:'user_id'}}
    , question: {type: Sequelize.TEXT, allowNull: true}
    , category: {type: Sequelize.INTEGER, allowNull: true}
}, {
    timestamps: false
});

//질문 목록 가져오기
QuestionModel.getQuestionList = function() {
    return new Promise((resolve,reject)=> {
        QuestionModel.findAndCount().then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

//질문하기
QuestionModel.addQuestion = function(req) {
    return new Promise((resolve,reject)=> {
        let intCategory = req.body.category;

        QuestionModel.create({
            user_id: req.user.email,
            category: parseInt(intCategory),
            question: req.body.question
            }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    })
};
//질문 삭제
QuestionModel.deleteQuestion = function(question_id) {
    return new Promise((resolve,reject)=> {
        QuestionModel.destroy({
            where: {question_id: question_id}
        }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = QuestionModel;