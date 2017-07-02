const express = require('express');
const UserModel = require('./user.model');
const UserValidation = require('./usersValidation');
const PetModel = require('../pet/pet.model');
const auth = require('./auth');

var router = express.Router();

router.route('/')
    .post(addUser)
    .get(showUser)
    .delete(deleteUser)
    .put(editUser);

router.route('/check/:nickname')
    .get(checkNickname);

router.post('/login', handleLogin);
router.post('/fb_success', fbUserInfo);
router.post('/naver_check', naverUserCheck);
router.post('/naver_success', naverUserInfo);
router.get('/logout', auth.isAuthenticated(), handleLogout);
router.get('/basic', auth.isAuthenticated(), basicInfo);

router.route('/:email')
    .get(checkUniqueEmail);

//router.route('/users/lists')
//  .get(showUserLists);

/*router.post('/test', auth.isAuthenticated(), cookieExtractor);*/

async function naverUserCheck(req, res) {
    let email = req.body.email;
    let nickname = req.body.nickname;
    let birthday = req.body.birthday;
    let gender = req.body.gender;

    let payloadInfo = {
        "email": email,
        "nickname": nickname,
        "birthday": birthday,
        "gender": gender
    };

    if ((await UserModel.isUniqueEmail(email)) === 1) {
        let petInfo = await PetModel.getSimplePetByUser(email);

        if (petInfo != null && petInfo != undefined) {
            payloadInfo.image = petInfo.image_url;
            payloadInfo.pet_name = petInfo.name;
            payloadInfo.pet_gender = petInfo.gender;
        } else {
            payloadInfo.image = null;
            payloadInfo.pet_name = "추가해주세요";
            payloadInfo.pet_gender = "추가해주세요";
        }
        let token = await UserValidation.userToken(payloadInfo);
        res.cookie('token', token, {maxAge: 8640000000, expires: new Date(Date.now() + 8640000000)});
        res.send({msg: 'exist', token: token});
    } else {
        res.send({msg: 'No'});
    }
}

async function naverUserInfo(req, res) {
    let email = req.body.email;
    let nickname = req.body.nickname;
    let birthday = req.body.birthday;
    let gender = req.body.gender;

    let payloadInfo = {
        "email": email,
        "nickname": nickname,
        "birthday": birthday,
        "gender": gender
    };

    payloadInfo.pw = 0;
    payloadInfo.salt = 0;
    payloadInfo.birthday = birthday;
    await UserModel.addUser(payloadInfo);
    await UserModel.addMongoUser(payloadInfo);
    res.send("naver로 회원가입");
}

async function fbUserInfo(req, res){
    let email = req.body.email;
    let name = req.body.name;
    let age_range = req.body.min;
    let gender;
    if(req.body.gender === "male")
        gender = 1;
    else
        gender = 2;

    let payloadInfo = {
        "email" : email,
        "nickname" : name,
        "gender" : gender
    };

    if((await UserModel.isUniqueEmail(email)) === 1){
        let petInfo = await PetModel.getSimplePetByUser(email);

        if(petInfo != null && petInfo != undefined){
            payloadInfo.image = petInfo.image_url;
            payloadInfo.pet_name = petInfo.name;
            payloadInfo.pet_gender = petInfo.gender;
        }else{
            payloadInfo.image = null;
            payloadInfo.pet_name = "추가해주세요";
            payloadInfo.pet_gender = "추가해주세요";
        }
        let token = await UserValidation.userToken(payloadInfo);
        res.cookie('token', token, {maxAge: 8640000000, expires: new Date(Date.now() + 8640000000)});
        res.send({msg: 'success', token: token});
    }else{
        payloadInfo.pw = 0;
        payloadInfo.salt = 0;
        payloadInfo.birthday = age_range;
        await UserModel.addUser(payloadInfo);
        await UserModel.addMongoUser(payloadInfo);
        res.send("else");
    }
}

async function basicInfo(req, res){
    let userInfo = await UserModel.loginUser(req.user.email); //테이블에 있는 비번
    let petInfo = await PetModel.getSimplePetByUser(req.user.email);

    let basicInfo = {
        "email" : userInfo.data.user_id,
        "nickname" : userInfo.data.nickname,
        "gender" : userInfo.data.gender,
        "image" : petInfo.image_url,
        "pet_name" : petInfo.name,
        "pet_gender" : petInfo.gender
    };
    res.send(basicInfo);
}

function cookieExtractor(req, res) {
    //console.log(req.cookies);
    //console.log(req);
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies.token;
    }
    //req.user.email 으로
    //req.user.nickname 으로
    //console.log(token);
    //console.log(decoded);
    res.send(req.user);
};


async function handleLogin(req, res){
    let token;
    try{
        let userInfo = await UserModel.loginUser(req.body.email); //테이블에 있는 비번
        let petInfo = await PetModel.getSimplePetByUser(req.body.email);
        let encrypted = await UserValidation.generatePassword(req.body.pw, userInfo.data.salt);

        let payloadInfo = {
            "email" : userInfo.data.user_id,
            "nickname" : userInfo.data.nickname,
            "gender" : userInfo.data.gender
        };

        if(petInfo != null && petInfo != undefined){
            payloadInfo.image = petInfo.image_url;
            payloadInfo.pet_name = petInfo.name;
            payloadInfo.pet_gender = petInfo.gender;
        }

        if(encrypted.hash === userInfo.data.pw) {
            token = await UserValidation.userToken(payloadInfo);
            res.cookie('token', token, {maxAge: 8640000000, expires: new Date(Date.now() + 8640000000)});
            res.send({msg: 'success', token: token});
        }else{
            res.status(401).send({msg:"이메일, 비밀번호를 확인해 주세요"});
        }

    }catch (err){
        res.status(500).send({msg:"로그인 실패"});
    }
}

function handleLogout(req, res){
    res.clearCookie('token');
    res.send('success');
}

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
    try{
        let user_info = await UserValidation.userInputValidation(req);
        if(user_info.msg !== "success"){
            res.status(400).send({msg:"필수 정보 누락(아이디, 비밀번호, 성별, 생년월일은 필수 입력 정보입니다"});
            return
        }
        let pw_info = await UserValidation.generatePassword(user_info.data.pw, "초기유저");
        let send_info = await UserValidation.sendInfo(user_info.data, pw_info);
        await UserModel.addUser(send_info);
        await UserModel.addMongoUser(send_info); // mysql 성공시 mongdoDb에도 추가
        res.send("회원 가입 성공");
    }catch (err){
        res.status(500).send({msg:"회원가입 에러"});
    }
}

async function showUser(req, res) {
    try{
        let token = await UserValidation.decodingToken(req.headers.authorization);
        let result = await UserModel.showUser(token.user_email);
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

module.exports = router;