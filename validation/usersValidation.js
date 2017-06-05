const crypto = require('crypto');

class Validation{
}

Validation.userInputValidation = function(req) {

    return new Promise((resolve, reject) =>{

        const email = req.body.email;
        const pw = req.body.pw;
        const gender = req.body.gender;
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

Validation.generatePassword = function(user_pw){
    return new Promise((resolve, reject) =>{
        try{

            const randomInt = Math.round(Math.random()*100000000);
            user_pw += randomInt;
            const hash = crypto.createHash('sha256').update(user_pw).digest('base64');
            const pw_info = {
                hash : hash,
                salt: randomInt
            };
            resolve(pw_info);
        }catch( error ){
            reject("generate Password Error");
        }

    });
};

Validation.userToken = function(){

    return new Promise((resolve, reject)=> {
        //로그인이 구현 되고 보내온 토큰 정보로  디코딩 ==>이메일
        const tempEmail = "asdf@gmail.com";
       try{
            resolve(tempEmail);
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


module.exports = Validation;