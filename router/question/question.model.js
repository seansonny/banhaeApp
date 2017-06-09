const Sequelize = require('sequelize');
const sequelize = require('../../connection/mysqlConfig');

let QuestionModel = sequelize.define('question', {
    question_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true}
    , user_id: {type: Sequelize.STRING, references:{model:'../../model/usersModel', key:'user_id'}}
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
QuestionModel.addQuestion = function() {
    return new Promise((resolve,reject)=> {
        QuestionModel.create({
            user_id: "ddkkd1",
            question: "언제 버전업해요?",
            category: 1
                }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

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