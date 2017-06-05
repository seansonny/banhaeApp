const express = require('express');
const UserModel = require('./user.model');
const UserValidation = require('./usersValidation');
const conn = require('../../connection/mongooseConnection');

var router = express.Router();

router.route('/')
    .post(addUser)
    .get(showUser)
    .delete(deleteUser)
    .put(editUser);

router.route('/check/:nickname')
    .get(checkNickname);

router.route('/:email')
    .get(checkUniqueEmail);

//router.rout('/users/lists')
//  .get(showUserLists);

async function checkUniqueEmail(req, res){
    const email = req.params.email;
    console.log(email);
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
        let user_info = await UserValidation.userInputValidation(req);
        if(user_info.msg !== "success"){
            res.status(789).send({msg:"필수 정보 누락(아이디, 비밀번호, 성별, 생년월일은 필수 입력 정보입니다"});
            return
        }
        let pw_info = await UserValidation.generatePassword(user_info.data.pw);
        let send_info = await UserValidation.sendInfo(user_info.data, pw_info);

        let result = await UserModel.addUser(send_info);
        // mysql 성공시 mongdoDb에도 추가
        let mongoDbUser = await UserModel.addMongoUser(send_info);

        if (result === mongoDbUser === "success"){
            res.send("회원 가입 성공");
        }else{
            res.send("회원 가입 에러");
        }
        //로그인 로직
}

async function showUser(req, res) {
    try{
        let user_email = await UserValidation.userToken(req); //클라이언트에서 보낸 토큰정보에서 email꺼내기(UerValidation)
        let result = await UserModel.showUser(user_email);
        res.send(result);
    }catch ( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

async function deleteUser(req, res){
    try{
        let user_token = await UserValidation.userToken(req); //로그인 시 발부되는 토큰 정보에서 email꺼내기
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
        let token = await UserValidation.userToken(); //로그인 시 발부되는 토큰 정보에서 email꺼내기
        let editUser = await UserModel.editUser(pw_info, req, token);
        res.send(editUser);
    }catch ( error ){
        res.status(error.code).send({msg:error.msg});
    }
}

module.exports = router;