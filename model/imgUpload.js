var express = require('express');
var fs = require('fs');

var AWS = require('aws-sdk');
var config = require('../connection/s3Config.json');

AWS.config.region = config.region;
AWS.config.accessKeyId = config.accessKeyId;
AWS.config.secretAccessKey = config.secretAccessKey;

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
            //console.log(file);
            let s3 = new AWS.S3();
            let contentType = file.mimetype;
            let readStream = fs.createReadStream(file.path);
            // 버킷 내 객체 키 생성
            let itemKey = 'dd/' + file.originalname;
            let bucketName = config.bucketName;
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
                    resolve();
                }
            });
    })
};

ImgUpload.deleteLocalFile = function(file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file.path, function(err){
            if(err){
                console.log(err);
                reject(err);
            }else{
                resolve({msg: "success"});
            }

        });
    })
};

module.exports = ImgUpload;