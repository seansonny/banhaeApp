const express = require('express');
const QuestionModel = require('./question.model');
const router = express.Router();

router.get('/', getQuestionList);  //질문 목록 가져오기
router.post('/', addQuestion); //질문하기
router.delete('/:question_id', deleteQuestion); //질문 삭제하기

async function getQuestionList(req, res) {
    try {
        const question = await QuestionModel.getQuestionList();
        let result = { data:question, msg:"getQuestionList 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function addQuestion(req, res) {
    try {
        //입력 처리
        const question = await QuestionModel.addQuestion();
        let result = { data:question, msg:"addQuestion 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function deleteQuestion(req, res) {
    try {
        let question_id = req.params.brand_id;
        if(!question_id) {
            res.send({"msg":"No Question ID!!"})
        }

        const question = await QuestionModel.deleteQuestion(question_id);
        let result = { data:question, msg:"deleteQuestion 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

module.exports = router;