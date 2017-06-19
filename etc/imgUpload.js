var express = require('express');
var fs = require('fs');
var gm = require('gm');
var AWS = require('aws-sdk');
var config = require('../dbConnections/s3Config.json');

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

ImgUpload.s3Upload = function(file, directory){
    return new Promise((resolve, reject) =>{
        let s3 = new AWS.S3();
        let contentType = file.mimetype;
        let readStream = fs.createReadStream(file.path);
        // 버킷 내 객체 키 생성
        let date = new Date().getTime();
        let folderName = directory;
        let itemKey = folderName + '/'  + date + file.originalname;
        let bucketName = config.bucketName;
        let params = {
            Bucket: bucketName,     // 필수
            Key: itemKey,            // 필수
            ACL: 'public-read',
            Body: readStream,
            ContentType: 'image/png'
        }

        s3.putObject(params, function (err, data) {
            if (err) {
                console.error('S3 PutObject Error', err);
                reject(err);
            }
            else {
                var imageUrl = s3.endpoint.href + bucketName + '/' + itemKey;

                resolve({url: imageUrl, itemKey:itemKey, folder: folderName});
            }
        });
    })
};

ImgUpload.deleteS3 = function(itemKey) {
    let s3 = new AWS.S3();
    let bucketName = config.bucketName;
    let params = {
        Bucket: bucketName,
        Key: itemKey
    };

    s3.deleteObject(params, function (err) {
        if (err) {console.log(err); }
    });
}

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