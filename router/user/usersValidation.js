const crypto = require('crypto');

class Validation{
}
const jwt = require('jsonwebtoken');
// Passport 설정

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const secretKey = 'secretttt';

   var opts = {
       jwtFromRequest: ExtractJwt.fromHeader('authorization'),
       secretOrKey: secretKey
     };

Validation.jwtVerification = function (req) {
    return new Promise((resolve, reject)=> {
        jwt.verify(req.cookies.token, secretKey, (err, decoded) => {
            if (err) {
                reject("Invalid Token");
                return;
            }
            resolve(decoded.email);
        });
    })
};

Validation.userInputValidation = function(req) {

    return new Promise((resolve, reject) =>{
        const email = req.body.email;
        const pw = req.body.pw;
        const gender = parseInt(req.body.gender);
        const birthday = req.body.birthday;
        const nickname = req.body.nickname;
        let message = {};
        if (email && pw && gender && birthday){
            message.msg = "success";
            message.data = {
                email : email,
                birthday : birthday,
                gender : gender,
                pw : pw
            };

            if(nickname) message.data.nickname = nickname;

        }else{
            message.msg = "필수 정보 누락 (이메일, 비번, 생년월일, 성별)";
            message.data = false;
        }
        resolve(message);
    })
};

Validation.decodingToken = function(authorization){
    return new Promise((resolve, reject) =>{
        try{
            //decode 성공시
            let token = {
                "user_email" : "asdf@gmail.com"
            };
            resolve(token);
        }catch( err ){
            reject("decodingToken Error");
        }
    })
};

Validation.generatePassword = function(user_pw, salt){
    return new Promise((resolve, reject) =>{
        try{
            if(salt === "초기유저"){
                salt = Math.round(Math.random()*100000000);
            }
            user_pw += salt;

            const hash = crypto.createHash('sha256').update(user_pw).digest('base64');
            const pw_info = {
                hash : hash,
                salt: salt
            };
            resolve(pw_info);
        }catch( error ){
            reject("generate Password Error");
        }

    });
};

Validation.userToken = function(payloadInfo){
    return new Promise((resolve, reject)=> {
        //로그인이 구현 되고 보내온 토큰 정보로  디코딩 ==>이메일
       try{
            const payload = {
               email: payloadInfo.email,
               nickname: payloadInfo.nickname,
                gender: payloadInfo.gender,
                image: payloadInfo.image,
                pet_name:payloadInfo.pet_name,
                pet_gender: payloadInfo.pet_gender
            };
            const option = {
               expiresIn: '1 year'
            };
            const token = jwt.sign(payload, secretKey, option);
            resolve(token);
       } catch( error ){
           reject("No valid token");
       }
    })
};

Validation.sendInfo = function(user_info, pw_info){
    return new Promise((resolve, reject) => {
        try{
            const sendInfo = {
                email : user_info.email,
                nickname : user_info.nickname,
                pw : pw_info.hash,
                birthday : user_info.birthday,
                gender : user_info.gender,
                salt : pw_info.salt,
            };
            resolve(sendInfo);
        }catch( error ) {
            reject("sendInfo Error");
        }
    })
};

Validation.isValue = function(pw_info){
    return new Promise((resolve, reject) => {
        try{
            if(pw_info != null && pw_info != "" && pw_info != undefined) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch(err) {
            reject(err);
        }
    })
};

module.exports = Validation;