const express = require('express');
const PetModel = require('./pet.model');
const router = express.Router();

router.get('/list', getPetList);  //펫 목록 가져오기
router.get('/:pet_id', getPetByID);  //펫 상세보기
router.post('/', addPet); //펫 추가하기
router.put('/:pet_id', updatePet); //펫 정보 수정하기
router.delete('/:pet_id', deletePet); //펫 정보 삭제하기

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