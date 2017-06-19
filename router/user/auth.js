var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');
const secretKey = 'secretttt';

// 토큰을 해석하여 유저 정보를 얻는 함수
function isAuthenticated() {
    return compose()
    // Validate jwt
        .use(function(req, res, next) {
            jwt.verify(req.cookies.token, secretKey, (err, decoded) => {
                if(err) {
                    /*res.clearCookie('token').send(req.cookies.token);*/
                    res.cookie('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZGZAZ21haWwuY29tIiwibmlja25hbWUiOiIxMjM867mE67KIIiwiZ2VuZGVyIjoxLCJpbWFnZSI6Imh0dHBzOi8vczMuYXAtbm9ydGhlYXN0LTIuYW1hem9uYXdzLmNvbS9iYW5oYWVidWNrZXQvcGV0cy8lRUIlOEIlQTQlRUIlQTElQjElRUMlOUQlQjRfJUVDJThCJUE0JUVEJTgyJUE0JUVEJTg1JThDJUVCJUE2JUFDJUVDJTk2JUI0LnBuZystdCorV2VkK0p1biswNysyMDE3KzExJTNBNDQlM0EzNCsiLCJwZXRfbmFtZSI6IuuLpOuhseydtCIsImlhdCI6MTQ5Nzg3NTU3NCwiZXhwIjoxNTI5NDMzMTc0fQ.PdTGchG5AkCZwrLI17APiPWkZs4yg4bPhZwYCXZ2z88", {maxAge: 8640000000, expires: new Date(Date.now() + 8640000000)});
                    res.status(401).send({msg:"No Token"});
                    return;
                }
                req.user = decoded;
                next();
            });
        })
}

exports.isAuthenticated = isAuthenticated;