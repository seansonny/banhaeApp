const RequestModel = require('./request.model');
const express = require('express');
const router = express.Router();
const auth = require('../user/auth');

router.get('/', getRequestList);  //요청 목록 가져오기
router.post('/', auth.isAuthenticated(), addRequest); //요청하기
router.delete('/:request_id', deleteRequest); //요청 삭제하기

async function getRequestList(req, res) {
    try {
        const request = await RequestModel.getRequestList();
        let result = {data: request, msg:"success"};
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function addRequest(req, res) {
    try {
        const request = await RequestModel.addRequest(req);
        let result = {data: request, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function deleteRequest(req, res) {
    try {
        const request = await RequestModel.deleteRequest(req.params.request_id);
        let result = {data: request, msg:"success"};
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

module.exports = router;