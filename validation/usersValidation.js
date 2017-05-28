const crypto = require('crypto');

class Validation{
}

Validation.userInfo = function(req){

    return new Promise((resolve, reject)=> {
        try{
            const user_email = req.body.email;
            const nickname = req.body.nickname;
            const randomInt = Math.round(Math.random()*100000000);
            const pw = req.body.pw + randomInt;
            const hash = crypto.createHash('sha256').update(pw).digest('base64');
            const gender = req.body.gender;
            const birth = req.body.birth;
            const token = "token010203040"; //토큰 로직 필요

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