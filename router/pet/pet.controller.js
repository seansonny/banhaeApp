const express = require('express');
const PetModel = require('./pet.model');
const fs = require('fs');
const router = express.Router();
const imgUp = require('../../model/imgUpload');

//multer 기본 설정
const multer = require('multer');
const upload = multer({
    dest : 'tmp'
});

//routing
router.get('/list', getPetList);  //펫 목록 가져오기
router.get('/:pet_id', getPetByID);  //펫 상세보기
router.post('/', addPet);  //펫 정보 추가
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
            let pet_info = await PetModel.getPetImg(pet_id);       //이전 파일이름, url 가져오기
            if(pet_info.image_url != "https://s3.ap-northeast-2.amazonaws.com/banhaebucket/defalutPetImage.png") {
                if(pet_info.image_url!=null) {
                    let itemKey = pet_info.image_key;
                    imgUp.deleteS3(itemKey);
                }
            }
            await imgUp.resizingImg(file, 200, 200);     // 사이즈 조정
            let img_url = await imgUp.s3Upload(file, 'pets');     //s3에 업로드
            console.log(img_url);
            await PetModel.uploadPetImg(pet_id, img_url.itemKey, img_url.url);      //db에 파일이름 저장하기
            let result = {msg:"addPetImg 성공" };
            res.send(result);
        }
    } catch (err) {
        res.send(err);
    } finally{
        await imgUp.deleteLocalFile(req.file);
    }
}

//펫 이미지 삭제
async function deletePetImg(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }

        let pet_info = await PetModel.getPetImg(pet_id);    //이전 사진 파일_url 가져오기
        let itemKey = pet_info.image_key;

        await imgUp.deleteS3(itemKey);
        await PetModel.deletePetImg(pet_id);   //db에 디폴트값 넣어두기
        let result = {msg:"deletePetImg 성공" };
        res.send(result);
    } catch (err) {
        res.send(err);
    }
}

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
        const pet = await PetModel.addPet(req);
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