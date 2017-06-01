const express = require('express');
const UserModel = require('../model/usersModel');
const UserValidation = require('../validation/usersValidation');
const conn = require('../connection/mongooseConnection');

var router = express.Router();

router.route('/users')
    .post(addUser)
    .get(showUser)
    .delete(deleteUser)
    .put(editUser);

router.route('/users/check/:nickname')
    .get(checkNickname);

router.route('/users/myReviews')
    .get(showMyReviews);

router.route('/users/:email')
    .get(checkUniqueEmail);


//router.rout('/users/lists')
//  .get(showUserLists);

async function checkUniqueEmail(req, res){
    const email = req.params.email;
    let message;
    try{
        let count = await UserModel.isUniqueEmail(email);
        if (count) {
            message = "이미 가입되있는 이메일";
        }else {
            message = "사용 가능한 이메일";
        }
        res.send({msg: message});

    }catch( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

async function addUser(req, res) {
    try{
        let user_info = await UserValidation.userInputValidation(req);
        let pw_info = await UserValidation.generatePassword(user_info.pw);
        let user_token = await UserValidation.userToken();
        let send_info = await UserValidation.sendInfo(user_info, pw_info, user_token);
        conn.connect();
        let result = await UserModel.addUser(send_info);
        conn.disconnect();
        // mysql 성공시 mongdoDb에도 추가
        let mongoDbUser = await UserModel.addMongoUser(send_info);

        let message;
        if (result){
            message = "회원 가입 성공";
        }
        res.send({msg: message});
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

async function checkNickname(req, res){
    try{
        let message;
        let count = await UserModel.isUniqueNickname(req.params.nickname);
        //닉네임과 * 비교해서 본인이 사용중인 닉네임도 사용 할 수 있는 닉네임으로 로직 추가
        if(count){
            message = "사용 할 수 없는 닉네임";
        }else{
            message = "사용 할 수 있는 닉네임";
        }
        res.send({msg:message});
    }catch(error){
        res.status(error.code).send({msg:error.msg});
    }
}

async function editUser(req, res){
    try{
        let isPassword = await UserValidation.isValue(req.body.pw);

        let pw_info;
        if(isPassword){
            pw_info = await UserValidation.generatePassword(req.body.pw);
        }
        let token = await UserValidation.userToken();
        let editUser = await UserModel.editUser(pw_info, req, token);
        res.send(editUser);
    }catch ( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

function showMyReviews(req, res){

}

module.exports = router;