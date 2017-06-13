const express = require('express');
const QuestionModel = require('./question.model');
const router = express.Router();
const auth = require('../user/auth');

router.get('/', getQuestionList);  //질문 목록 가져오기
router.post('/', auth.isAuthenticated(),addQuestion); //질문하기
router.delete('/:question_id', deleteQuestion); //질문 삭제하기

async function getQuestionList(req, res) {
    try {
        const question = await QuestionModel.getQuestionList();
        let result = { data:question, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function addQuestion(req, res) {
    try {
        const question = await QuestionModel.addQuestion(req);
        let result = { data:question, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function deleteQuestion(req, res) {
    try {
        let question_id = req.params.question_id;
        if(question_id == undefined) {
            res.status(400).send({"msg":"No Question ID!!"})
            return;
        }
        const question = await QuestionModel.deleteQuestion(question_id);
        let result = { data:question, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

module.exports = router;