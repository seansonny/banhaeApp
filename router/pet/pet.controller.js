const express = require('express');
const PetModel = require('./pet.model');
const fs = require('fs');
const router = express.Router();
const imgUp = require('../../model/imgUpload');

//multer 기본 설정
const multer = require('multer');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now()) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});
let upload = multer({ storage: storage });

//AWS 기본 설정
const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = 'AKIAIFGQSWP3J5F5XDGA';
AWS.config.secretAccessKey = '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';
let s3 = new AWS.S3();
const bucketName = 'banhaebucket';

//routing
router.get('/list', getPetList);  //펫 목록 가져오기
router.get('/:pet_id', getPetByID);  //펫 상세보기
router.post('/', addPet);  //펫 상세보기
router.put('/:pet_id', updatePet); //펫 정보 수정하기
router.delete('/:pet_id', deletePet); //펫 정보 삭제하기
router.post('/upload/:pet_id', upload.single('myPet'), uploadPetImg); //펫 이미지 업로드
router.post('/upload', function (req,res) {
    res.send("No pet_id");
});
router.delete('/upload/:pet_id', deletePetImg); //펫 이미지 삭제


//펫 이미지 업로드
async function uploadPetImg(req, res) {
    try {
        let pet_id = req.params.pet_id;
        let file = req.file;

        // 유효성 검사(pet_id, file)
        if((pet_id == undefined)||(file == null)) {
            res.send("No pet_id or file");
        }
        else {
            let pet_info = await PetModel.getPetImg(pet_id);       //이전 사진 파일이름 가져오기

            if(pet_info.image != "https://s3.ap-northeast-2.amazonaws.com/banhaebucket/defalutPetImage.png") {
                await deleteS3(pet_id);
            }

            let contentType = file.mimetype;
            let itemKey = 'pets/' + file.filename;
            let resized_img = await imgUp.resizingImg(file, 200, 200);
            let readStream = fs.createReadStream(resized_img);

            let img_url = await uploadS3(contentType, readStream, itemKey);     //s3에 업로드
            await PetModel.uploadPetImg(pet_id, img_url);   //db에 파일이름 저장하기
            let result = {msg:"addPetImg 성공" };
            res.send(result);
        }
    } catch (err) {
        res.send(err);
    } finally{
        fs.unlink(req.file.path, function (err) {
            if (err) throw err;
            console.log('파일을 정상적으로 삭제하였습니다.');
        });
    }
}

function uploadS3(contentType, readStream, itemKey) {
    return new Promise((resolve,reject)=> {
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
                let img_url = "https://s3.ap-northeast-2.amazonaws.com/" + itemKey;
                resolve(img_url);
            }
        });
    });
}

//펫 이미지 삭제
async function deletePetImg(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(pet_id == undefined) {
            res.send({"msg":"No Pet ID!!"})
        }

        let pet_info = await PetModel.getPetImg(pet_id);    //이전 사진 파일_url 가져오기
        let beforeStr = pet_info.image;
        let afterStr = beforeStr.split('/');
        let itemKey = afterStr[3] + '/' +  afterStr[4];

        await deleteS3(itemKey);
        await PetModel.deletePetImg(pet_id);   //db에 디폴트값 넣어두기
        let result = {msg:"deletePetImg 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function deleteS3(itemKey) {
    let params = {
        Bucket: bucketName,
        Key: itemKey
    };
    await s3.deleteObject(params, function (error, data) {
        if (error) {console.log(error); }
    });
}
/* ---------------------------------------여기 아래로 완료---------------------------------------------------------------*/
async function getPetList(req, res) {
    try {
        const pet = await PetModel.getPetList();
        let result = { data:pet, msg:"getPetList 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function getPetByID(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }
        const pet = await PetModel.getPetByID(pet_id);
        let result = { data:pet, msg:"getPetByID 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}
//펫정보추가
async function addPet(req, res) {
    try {
        //입력 처리
        const pet = await PetModel.addPet();
        let result = { data:pet, msg:"addPet 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function updatePet(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }

        const pet = await PetModel.updatePet(pet_id);
        let result = { data:pet, msg:"updatePet 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

async function deletePet(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }

        const pet = await PetModel.deletePet(pet_id);
        let result = { data:pet, msg:"deletePet 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

module.exports = router;