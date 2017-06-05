var express = require('express');
var fs = require('fs');
var gm = require('gm');
var AWS = require('aws-sdk');
var config = require('../database/s3Config.json');

AWS.config.region = config.region;
AWS.config.accessKeyId = config.accessKeyId;
AWS.config.secretAccessKey = config.secretAccessKey;

class ImgUpload{
}

ImgUpload.serverUpload = function(req, res){
    return new Promise((resolve, reject) =>{
        try{
            const files = req.files;
            // 파일이 아닌 Text 데이터
            const fields = req.body;
            resolve({msg:'check', files:files, fields:fields});
        }catch(error){
            console.log(error);
            reject(error);
        }
    })
};

ImgUpload.sizeTest = function(img){
    return new Promise((resolve, reject) =>{
        gm(img.path)
            .size(function (err, size) {
                if (err) {
                    reject(err);
                    return;
                }
                let width = size.width;
                let height = size.height;
                resolve({msg:"success", data:{width:width, height:height}});
            });
    })
};

ImgUpload.resizingImg = function(img, width, height){
    return new Promise((resolve, reject) =>{
        let path = img.path;
        gm(path)
            .resize(width, height)
            .write(path, function (err) {
                if (err){
                  console.log(err);
                  reject()
                }
                else resolve(path)
            });
    })
}

// var resize = function (path, width, height) {
//     var deferred = q.defer();
//     var ext = path.substr(path.lastIndexOf('.'), path.length);
//     var writePath = path.substr(0, path.lastIndexOf('.')) + '_' + width + '_' + height + ext;
//
//     gm(path)
//         .resize(width, height)
//         .write(writePath, function (err) {
//             if (err) deferred.reject();
//             else deferred.resolve();
//         });
//     return deferred.promise;
// };

ImgUpload.s3Upload = function(title, file, directory){
    return new Promise((resolve, reject) =>{
            //console.log(file);
            let s3 = new AWS.S3();
            let contentType = file.mimetype;
            let readStream = fs.createReadStream(file.path);
            // 버킷 내 객체 키 생성
            let date = new Date().toString().split('GMT')[0];
            let folderName = directory;
            let itemKey = folderName + '/' + file.originalname +' -t* '+ date;
            let bucketName = config.bucketName;
            let params = {
                Bucket: bucketName,     // 필수
                Key: itemKey,            // 필수 reviews/%EB%8F%99%EA%B8%B0%EC%8B%9D.png+-t*+Thu+Jun+01+2017+12%3A46%3A47+
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
                    var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey; //itemKey ==> https://s3.ap-northeast-2.amazonaws.com/banhaebucket/reviews/%EB%8F%99%EA%B8%B0%EC%8B%9D.png+-t*+Thu+Jun+01+2017+12%3A46%3A47+
                    // var imageSignedUrl = s3.getSignedUrl('getObject', { Bucket: bucketName, Key: itemKey });

                    resolve({url: imageUrl, folder: folderName});
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