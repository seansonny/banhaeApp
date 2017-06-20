const express = require('express');
const PetModel = require('./pet.model');
const age = require('../../etc/age');
const fs = require('fs');
const router = express.Router();
const imgUp = require('../../etc/imgUpload');
const auth = require('../user/auth');

//multer 기본 설정
const multer = require('multer');
const upload = multer({
    dest : 'tmp'
});

router.get('/list', auth.isAuthenticated(), getPetList);  //펫 목록 가져오기
router.get('/mainPet', auth.isAuthenticated(), getMainPet);  //메인 펫 상세정보
router.get('/:pet_id', getPetByID);  //펫 상세보기
router.post('/', upload.any(), auth.isAuthenticated(), addPet);  //펫 정보 추가
router.put('/:pet_id', upload.any(), auth.isAuthenticated(),updatePet); //펫 정보 수정하기
router.delete('/:pet_id', deletePet); //펫 정보 삭제하기

async function getMainPet(req, res) {
    try {
        let mainPet = await PetModel.getSimplePetByUser(req.user.email);
        let pet_age = await age.countAge(mainPet.birthday);

        let info = {
            age: pet_age
            , name: mainPet.name
            , image_url: mainPet.image_url
            , gender: mainPet.gender
            , weight: mainPet.weight
            , type: mainPet.type
            , pet_id: mainPet.pet_id
        };

        let result = {data: info, msg: "success"};
        res.send(result);
    } catch (err) {
        res.status(500).send();
    }
}


async function getPetList(req, res) {
    try {
        const pet = await PetModel.getPetList(req.user.email);

        let info = {};
        info.count = pet.count;
        info.pets = [];

        //pet list 재구성
        for(let i=0;i<pet.rows.length;i++) {
            let pet_age = await age.countAge(pet.rows[i].birthday);

            info.pets.push({age: pet_age, name:pet.rows[i].name, image_url:pet.rows[i].image_url, gender:pet.rows[i].gender,
                weight:pet.rows[i].weight, type:pet.rows[i].type, pet_id:pet.rows[i].pet_id, main_pet:pet.rows[i].main_pet})
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
        let main_pet = req.body.main_pet;

        //유효성 체크
        if (!req.body.name || !req.body.birthday || !req.body.weight /*|| !req.user.email*/ || !req.body.type || !req.body.gender || !main_pet) {
            res.status(400).send({msg:"필수 입력값을 다 줘야죠"});
            return;
        }
        //만약 추가하는 강아지가 사용자의 첫 번째 강아지라면 -> 사용자의 아이디로 나오는 강아지가 없다면 main_pet = 2;
        const myPet = await PetModel.getPetList(req.user.email);

        if(myPet.count == 0) {
            main_pet = 2;
        }else if(main_pet == 2){
            let mainPet = await PetModel.getSimplePetByUser(req.user.email);  //메인펫 id 가져오기
            await PetModel.changeMainPet(mainPet.pet_id);
        }

        const pet = await PetModel.addPet(req.body, req.user, main_pet);

        if (req.files[0] && req.files[0] != undefined){
            await uploadPetImg(pet.pet_id, req.files[0]);
        }

        let result = { data:pet, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:"서버 내부 오류"});
    }
}

async function updatePet(req, res) {
    try {
        let main_pet = req.body.main_pet;
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }

        let mainPet = await PetModel.getPetByID(pet_id);  //해당 펫이 대표견인가?

        if(mainPet.main_pet == 1) {
            if(main_pet == 2) {
                let mainPet = await PetModel.getSimplePetByUser(req.user.email);  //메인펫 id 가져오기
                await PetModel.changeMainPet(mainPet.pet_id);
            }
            await PetModel.updatePet(pet_id, req.body, main_pet);
        } else {
            main_pet = 2;
            await PetModel.updatePet(pet_id, req.body, main_pet);
        }

        if (req.files[0] && req.files[0] != undefined){
            let pet_info = await PetModel.getPetImg(pet_id);    //이전 사진 파일_url 가져오기
            let itemKey = pet_info.image_key;
            await imgUp.deleteS3(itemKey);
            await uploadPetImg(pet_id, req.files[0]);
        }
        let result = { msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:err});
    }
}

async function deletePet(req, res) {
    try {
        let pet_id = req.params.pet_id;
        if(!pet_id) {
            res.send({"msg":"No Pet ID!!"})
        }

        //대표견인지 아닌지 확인
        const chk_pet = await PetModel.getPetByID(pet_id);

        if(chk_pet.main_pet == 2) {
            res.send({msg:"noMainPetFalse"});
            return;
        }

        await deletePetImg(pet_id);
        const pet = await PetModel.deletePet(pet_id);
        let result = { data:pet, msg:"success" };
        res.send(result);
    } catch (err) {
        res.status(500).send({msg:"서버 내부 오류"});
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
