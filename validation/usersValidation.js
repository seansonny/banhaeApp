const crypto = require('crypto');

class Validation{
}

Validation.userInputValidation = function(req) {

    return new Promise((resolve, reject) =>{
        const user_email = req.body.email;
        const pw = req.body.pw;
        const gender = req.body.gender;
        const birth = req.body.birth;
        const nickname = req.body.nickname;

        if (!user_email||!pw||!gender||!birth){
            reject("필수 정보 누락 (이메일, 비번, 생년월일, 성별)");
        }
        const user_info = {
            email : user_email,
            birth : birth,
            gender : gender,
            pw : pw
        };

        if(nickname){
            user_info.nickname = nickname;
        }
        resolve(user_info);
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
        //로그인이 구현 되면 로그인 세션/토큰 에서 가져올 정보
        const tempToken = "token9876";
       try{
            resolve(tempToken);
       } catch( error ){
           reject("No valid token");
       }
    })
};


Validation.isValue = function(check){

    return new Promise((resolve, reject) => {
        let msg;
        try {
            if (check == null || check == "" || check == undefined) {
                msg = false;
            }
            else{
                msg = true;
            }

            resolve(msg);
        }catch (error){
            reject("isValue error");
        }
    })
};

Validation.sendInfo = function(user_info, pw_info, token){
    return new Promise((resolve, reject) => {
        try{
            const sendInfo = {
                email : user_info.email,
                nickname : user_info.nickname,
                pw : pw_info.hash,
                birth : user_info.birth,
                gender : user_info.gender,
                salt : pw_info.salt,
                token : token
            };
            resolve(sendInfo);
        }catch( error ) {
            reject("sendInfo Error");
        }
    })
};


module.exports = Validation;