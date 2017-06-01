var formidable = require('formidable');
var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var pathUtil = require('path');
/*var easyimg = require('easyimage');*/
var async = require('async');
var randomstring = require('randomstring');

var uploadDir = __dirname + '/tmp';

if (!fs.existsSync(uploadDir)) {
    console.error('tmp 폴더 없음!');
    process.exit();
}

// 이미지 파일 목록
var resources = [];

var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = 'AKIAIFGQSWP3J5F5XDGA';
AWS.config.secretAccessKey = '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';

// Listup All Files
var s3 = new AWS.S3();

const bucketName = 'banhaebucket';

var app = express();
app.post('/', uploadImage);
app.get('/', showImages);
app.listen(3000);

function uploadImage(req, res) {
    async.waterfall(
        [
            function (callback) {
                var form = new formidable.IncomingForm();
                form.encoding = 'utf-8';
                form.uploadDir = uploadDir;
                form.keepExtensions = true;
                form.parse(req, function (err, fields, files) {
                    if (err) {
                        return callback(err, null);
                    }

                    var title = fields.title;
                    // 임시 폴더로 업로드된 파일
                    var file = files.file;
                    callback(null, title, file);
                });
            },
            function (title, file, callback) {
                // 새로운 이미지 파일 이름 생성
                var randomStr = randomstring.generate(10); // 10자리 랜덤
                var newFileName = 'image_' + randomStr;
                var extname = pathUtil.extname(file.name); // 확장자
                var contentType = file.type;

                var readStream = fs.createReadStream(file.path);

                // 버킷 내 객체 키 생성
                var itemKey = 'dd/' + newFileName + extname;

                var params = {
                    Bucket: bucketName,     // 필수
                    Key: itemKey,            // 필수
                    ACL: 'public-read',
                    Body: readStream,
                    ContentType: contentType
                }

                s3.putObject(params, function (err, data) {
                    if (err) {
                        console.error('S3 PutObject Error', err);
                        callback(err);
                    }
                    else {
                        // 접근 경로 - 2가지 방법
                        var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;
                        var imageSignedUrl = s3.getSignedUrl('getObject', { Bucket: bucketName, Key: itemKey });
                        callback(null, title, imageUrl);
                    }
                });

                fs.unlink(file.path,
                    function(err){
                        if(err) throw err;
                        console.log('파일을 정상적으로 삭제하였습니다.');
                    }
                );
            },

            function (title, url, callback) {           //DB에 저장할 정보 만들기
                let username = 'dong';
                let id = 'banhae'
                var info = {
                    id: id,
                    username: username,
                    title: title,
                    image: url
                }
                resources.push(info);
                callback(null, info);
            },

            function (info, callback) {   //RDB 연결 + 정보 저장
                /*console.log(info);*/
                //DB 연결

                var connection = mysql.createConnection({
                    host     : 'banhaerdb.cpu3j20dvqwu.ap-northeast-2.rds.amazonaws.com',
                    user     : 'rdbadmin',
                    password : 'qksgoqksgo123',
                    port     : 3306
                });

                connection.connect(function(err) {
                    if (err) {
                        console.error('Database connection failed: ' + err.stack);
                        return;
                    }
                    console.log('Connected to database.');
                });

                let id = info.id;
                let username = info.username;
                let title = info.title
                let url = info.image;

                let query = connection.query('INSERT INTO image SET ?',[id,username,title,url], function(err, result) {
                    console.log(result);
                });

                connection.end();

                callback();
            }
        ],
        function (err) {
            if (err) {
                res.sendStatus(500);
            }
            else {
                res.redirect('./');
            }
        });
}

function showImages(req, res) {
    var body = '<html><body>';

    body += '<h3>File List</h3>';
    body += '<ul>';
    for (var i = 0; i < resources.length; i++) {
        var item = resources[i];
        body += '<li>' + '<img src="' + item.image + '" height="100">' + item.title + '</li>';
    }
    body += '</ul>';
    body += '<form method="post" action="/" enctype="multipart/form-data">';
    body += '<input type="text" name="title"><li>';
    body += '<input type="file" name="file"><li>';
    body += '<input type="submit" value="Uplaod"><li>';
    body += '</form>';

    res.send(body);
}