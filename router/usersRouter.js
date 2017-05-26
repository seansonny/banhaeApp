const express = require('express');
const fs = require('fs');
const UserModel = require('../usersModel');
const bodyParser = require('body-parser');

var router = express.Router();


router.route('/users')
    .post(addUser)
    .get(showUser)
    .delete(deleteUser)
    .put(editUser);

router.route('/users/myReviews')
    .get(showReviews);

//router.rout('/users/lists')
//  .get(showUserLists);


async function addUser(req, res) {
    try{
        const user_email = req.body.email;

        const nickname = req.body.nickname;
        const pw = req.body.pw; //비번 로직 필요
        const gender = req.body.gender;
        const birth = req.body.birth;
        const token = "token010203040"; //토큰 로직 필요

        var user_info = {
            user_id : user_email,
            nickname : nickname,
            pw : pw
        };
        if(gender){
            user_info.gender = gender;
        }
        if(birth){
            user_info.birth = birth;
        }
        if(token){
            user_info.token = token;
        }
        const result = await UserModel.addUser(user_info);
        res.send({msg:"Success"});
    }catch ( error ){
        console.log('Can not find, 404');
        res.status(error.code).send({msg:error.msg});
    }
}

function showUser(req, res) {

}

function deleteUser(req, res){

}

function editUser(req, res){

}

function showReviews(req, res){

}

module.exports = router;