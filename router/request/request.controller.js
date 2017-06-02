const RequestModel = require('./request.model');
const express = require('express');
const router = express.Router();

router.get('/', getRequestList);  //요청 목록 가져오기
router.post('/', addRequest); //요청하기
router.delete('/:request_id', deleteRequest); //요청 삭제하기

async function getRequestList(req, res) {
    try {
        const request = await RequestModel.getRequestList();
        let result = {data: request, msg: "getRequestList 성공"};
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function addRequest(req, res) {
    try {
        console.log(req.body.user_id);
        const request = await RequestModel.addRequest(req);
        let result = {data: request, msg: "addRequest 성공"};
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function deleteRequest(req, res) {
    try {
        const request = await RequestModel.deleteRequest(req.params.request_id);
        let result = {data: request, msg: "deleteRequest 성공"};
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

module.exports = router;