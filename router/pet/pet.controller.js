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

            if(pet_info.image != "defalutPetImage.png") {
                await deleteS3(pet_id);
            }

            let contentType = file.mimetype;
            let resizedPath = ['mypage_img/', 'search_img/', 'msg_img/', 'profile_img/'];
            let size = [330,168,144,120];

            for(let i=0;i<4;i++) {
                let itemKey = resizedPath[i] + file.filename;

                //이미지 리사이징 -> 파일 4가지로 추출 후 파일 path 삽입(어디에다가 올릴까? 임시파일 삭제 이슈도 존재
                let resized = await imgUp.resizingImg(file, size[i], size[i]);
                let readStream = fs.createReadStream(resized);  //파일 경로만 설정해주면 내가 수정한 파일이 올라가는구나!!

                await uploadS3(contentType, readStream, itemKey);     //s3에 업로드
            }

            await PetModel.uploadPetImg(pet_id, file.filename);   //db에 파일이름 저장하기
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
                resolve();
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

        let pet_info = await PetModel.getPetImg(pet_id);    //이전 사진 파일이름 가져오기
        let pet_fileName = pet_info.image;
        let resizedPath = ['mypage_img/', 'msg_img/', 'search_img/', 'profile_img/'];

        for(let i=0;i<4;i++) {
            let itemKey = resizedPath[i] + pet_fileName;
            await deleteS3(itemKey);
        }

        await PetModel.deletePetImg(pet_id);   //db에 디폴트 사진 넣어두기
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
        if (error) {console.log(error); } else {console.log(data);}
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