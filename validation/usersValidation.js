const crypto = require('crypto');

class Validation{
}

Validation.userInfo = function(req){

    return new Promise((resolve, reject)=> {

        try{
            const user_email = req.body.email;
            const nickname = req.body.nickname;
            const randomInt = Math.round(Math.random()*100000000);
            var pw = req.body.pw;

            var gender = req.body.gender;
            var birth = req.body.birth;
            const token = "token010203040"; //토큰 로직 필요

            if (!user_email||!pw||!gender||!birth){
                reject("필수 정보 누락 (이메일, 비번, 생년월일, 성별)");
            }
            pw += randomInt;
            const hash = crypto.createHash('sha256').update(pw).digest('base64');

            var user_info = {
                email : user_email,
                pw : hash,
                birth : birth,
                gender : gender,
                salt : randomInt
            };
            if(nickname){
                user_info.nickname = nickname;
            }
            if(token){
                user_info.token = token;
            }
            resolve(user_info);
        }catch ( error ){
            reject("validation failure");
        }
    });
}

module.exports = Validation;