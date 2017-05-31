var fs = require('fs');

var express = require('express');
var fs = require('fs');

var async = require('async');
var randomstring = require('randomstring');


var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = 'AKIAIFGQSWP3J5F5XDGA';
AWS.config.secretAccessKey = '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';

// Listup All Files



class ImgUpload{
}

ImgUpload.localUpload = function(req, res){
    return new Promise((resolve, reject) =>{
        try{
            const files = req.files;
            // 파일이 아닌 Text 데이터
            const fields = req.body;
            resolve({msg:'ok', files:files, fields:fields});
        }catch(error){
            reject(erro);
        }
    })

};

ImgUpload.s3Upload = function(title, file){
    return new Promise((resolve, reject) =>{

            let s3 = new AWS.S3();
            //let extname = pathUtil.extname(file.originalname); // 확장자
            let contentType = file.mimetype;
            let readStream = fs.createReadStream(file.path);
            // 버킷 내 객체 키 생성
            let itemKey = 'dd/' + file.originalname;
            let bucketName = 'banhaebucket';
            let params = {
                Bucket: bucketName,     // 필수
                Key: itemKey,            // 필수
                ACL: 'public-read',
                Body: readStream,
                ContentType: contentType
            }

            s3.putObject(params, function (err, data) {
                if (err) {
                    console.error('S3 PutObject Error', err);
                    reject(err);
                }
                else {
                    // 접근 경로 - 2가지 방법
                    var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;
                    // var imageSignedUrl = s3.getSignedUrl('getObject', { Bucket: bucketName, Key: itemKey });
                    // callback(null, title, imageUrl);
                }
            });

            // fs.unlink(file.path,
            //     function(err){
            //         if(err) throw err;
            //         console.log('파일을 정상적으로 삭제하였습니다.');
            //     }
            // );
            resolve();

    })
};
// function s3UploadandDb(req, res) {
//     async.waterfall(
//         [
//             function (title, file, callback) {

//             },
//
//             function (title, url, callback) {           //DB에 저장할 정보 만들기
//                 let username = 'dong';
//                 let id = 'banhae'
//                 var info = {
//                     id: id,
//                     username: username,
//                     title: title,
//                     image: url
//                 }
//                 resources.push(info);
//                 callback(null, info);
//             },
//
//             function (info, callback) {   //RDB 연결 + 정보 저장
//                 /*console.log(info);*/
//                 //DB 연결
//
//                 var connection = mysql.createConnection({
//                     host     : 'banhaerdb.cpu3j20dvqwu.ap-northeast-2.rds.amazonaws.com',
//                     user     : 'rdbadmin',
//                     password : 'qksgoqksgo123',
//                     port     : 3306
//                 });
//
//                 connection.connect(function(err) {
//                     if (err) {
//                         console.error('Database connection failed: ' + err.stack);
//                         return;
//                     }
//                     console.log('Connected to database.');
//                 });
//
//                 let id = info.id;
//                 let username = info.username;
//                 let title = info.title
//                 let url = info.image;
//
//                 let query = connection.query('INSERT INTO image SET ?',[id,username,title,url], function(err, result) {
//                     console.log(result);
//                 });
//
//                 connection.end();
//
//                 callback();
//             }
//         ],
//         function (err) {
//             if (err) {
//                 res.sendStatus(500);
//             }
//             else {
//                 res.redirect('./');
//             }
//         });
// }

module.exports = ImgUpload;