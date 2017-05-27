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
        console.log('Can not find, 404');
        console.log(error);
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