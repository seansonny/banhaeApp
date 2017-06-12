const express = require('express');
const PetModel = require('./pet.model');
const age = require('../../model/age');
const fs = require('fs');
const router = express.Router();
const imgUp = require('../../model/imgUpload');

//multer 기본 설정
const multer = require('multer');
const upload = multer({
    dest : 'tmp'
});

router.get('/list', getPetList);  //펫 목록 가져오기
router.get('/:pet_id', getPetByID);  //펫 상세보기
router.post('/', upload.any(),addPet);  //펫 정보 추가
router.put('/:pet_id', upload.any(), updatePet); //펫 정보 수정하기
router.delete('/:pet_id', deletePet); //펫 정보 삭제하기
/*router.post('/upload/:pet_id', upload.single('myPet'), uploadPetImg); //펫 이미지 업로드
router.post('/upload', function (req,res) {
    res.send("No pet_id");
});
router.delete('/upload/:pet_id', deletePetImg); //펫 이미지 삭제*/

async function getPetList(req, res) {
    try {
        const pet = await PetModel.getPetList();

        let info = {};
        info.count = pet.count;
        info.pets = [];

        //pet list 재구성
        for(let i=0;i<pet.rows.length;i++) {
            let pet_age = await age.countAge(pet.rows[i].birthday);

            info.pets.push({age: pet_age, name:pet.rows[i].name, image_url:pet.rows[i].image_url, gender:pet.rows[i].gender,
                weight:pet.rows[i].weight, type:pet.rows[i].type, pet_id:pet.rows[i].pet_id})
        }

        let result = { data:info, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function getPetByID(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }
        const pet = await PetModel.getPetByID(pet_id);
        let result = { data:pet, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

//펫정보추가
async function addPet(req, res) {
    try {
        //유효성 체크
        if (!req.body.name || !req.body.birthday || !req.body.weight || !req.body.user_id || !req.body.type || !req.body.gender || !req.body.main_pet) {
            res.status(400).send({msg:"필수 입력값을 다 줘야죠"});
            return;
        }
        const pet = await PetModel.addPet(req.body);

        if(req.files[0]!= null) {
            await uploadPetImg(pet.pet_id, req.files[0]);
        }

        let result = { data:pet, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function updatePet(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }

        const pet = await PetModel.updatePet(pet_id, req.body);

        if(req.files[0] != null) {
            let pet_info = await PetModel.getPetImg(pet_id);    //이전 사진 파일_url 가져오기
            let itemKey = pet_info.image_key;
            await imgUp.deleteS3(itemKey);
            await uploadPetImg(pet_id, req.files[0]);
        }
        let result = { data:pet, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}

async function deletePet(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }

        await deletePetImg(pet_id);
        const pet = await PetModel.deletePet(pet_id);
        let result = { data:pet, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err.msg});
    }
}
/*******************************************************************************************************************/
//펫 이미지 업로드
async function uploadPetImg(pet_id, file) {
    try {
        await imgUp.resizingImg(file, 500, 500);     // 사이즈 조정
        let img_url = await imgUp.s3Upload(file, 'pets');     //s3에 업로드
        await PetModel.uploadPetImg(pet_id, img_url.itemKey, img_url.url);      //db에 파일이름 저장하기
    } catch (err) {
        throw err;
    } finally{
        await imgUp.deleteLocalFile(file);
    }
}

//펫 이미지 삭제
async function deletePetImg(pet_id) {
    try {
        let pet_info = await PetModel.getPetImg(pet_id);    //이전 사진 파일_url 가져오기
        let itemKey = pet_info.image_key;

        await imgUp.deleteS3(itemKey);
        await PetModel.deletePetImg(pet_id);   //db에 디폴트값 넣어두기
    } catch (err) {
        throw err;
    }
}

module.exports = router;
