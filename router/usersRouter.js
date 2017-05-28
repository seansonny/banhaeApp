const express = require('express');
const UserModel = require('../model/usersModel');
const UserValidation = require('../validation/usersValidation');

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
        let user_info = await UserValidation.userInfo(req);
        let result = await UserModel.addUser(user_info);
        res.send({msg: result});
    }catch ( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

async function showUser(req, res) {
    try{
        let user_token = await UserValidation.userToken(req);
        let result = await UserModel.showUser(user_token);
        res.send(result);
    }catch ( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

async function deleteUser(req, res){
    try{
        let user_token = await UserValidation.userToken(req);
        let result = await UserModel.deleteUser(user_token);
        res.send(result);
    }catch(error){
        res.status(error.code).send({msg:error.msg});
    }
}

function editUser(req, res){

}

function showReviews(req, res){

}

module.exports = router;