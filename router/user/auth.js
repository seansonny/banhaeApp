var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
const secretKey = 'secretttt';

// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
    return compose()
    // Validate jwt
        .use(function(req, res, next) {
            var decoded = jwt.verify(req.cookies.token, secretKey);
            req.user = decoded;
           next();
        })
}

exports.isAuthenticated = isAuthenticated;