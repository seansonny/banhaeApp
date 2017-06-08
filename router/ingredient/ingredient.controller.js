const express = require('express');
const fs = require('fs');
const Ingredient = require('./ingredient.model');
const bodyParser = require('body-parser');

var router = express.Router();

router.route('/:ingredient_id')
    .get(showIngredientDetail)
    .delete(deleteIngredient)

router.route('/')
    .post(addIngredient)
    .put(editIngredient);
//  .get(showIngredientLists);


function showIngredientDetail(req, res, next) {
    const ingredientId = req.params.ingredient_id;
    console.log('ingredient_id: ' , ingredientId);

    Ingredient.getIngredientDetail(ingredientId, function(err, result){
        if( err ){
            return next(err);
        }

        res.send(result);
    });
}

function deleteIngredient(req, res) {
    const ingredientId = req.params.ingredient_id;
    console.log('ingredient_id: ', ingredientId);

    Ingredient.deleteIngredient(ingredientId, function(err, result){
        if ( err ){
            console.log(err);
            return next(err);
        }

        res.send(result);
    });
}

function addIngredient(req, res) {

    const ingredientId = req.body.ingredient_id;
    const l1 = req.body.l1;
    const l2 = req.body.l2;
    const l3 = req.body.l3;
    const role = req.body.role;
    const role_num = req.body.role_num;
    const description = req.body.description;
    const is_warning = req.body.is_warning;

    if(!ingredientId||!l1||!l2||!l3||!role||!role_num||!description||!is_warning){
        res.status(400).send({error:"필수 정보(id, l1, l2, l3, role, rolenum, desc, is_warning 누락"});
        return next(err);
    }

    const allergy = req.body.allergy;
    const warning = req.body.warning;


    var info = {
        ingredient_Id: ingredientId,
        l1 : l1,
        l2 : l2,
        l3 : l3,
        role: role,
        role_num : role_num,
        description : description,
        allergy : allergy,
        warning : warning,
        is_warning : is_warning
    };

    Ingredient.addIngredient(info, function(err, result){
        if( err ) {
            console.log(err);
            return next(err);
        }

        res.send(result);
    })
}

function editIngredient(req, res) {

    const ingredientId = req.body.ingredient_id;
    const l1 = req.body.l1;
    const l2 = req.body.l2;
    const l3 = req.body.l3;
    const role = req.body.role;
    const role_num = req.body.role_num;
    const description = req.body.description;
    const is_warning = req.body.is_warning;
    const allergy = req.body.allergy;
    const warning = req.body.warning;

    var info = {};
    info.ingredient_Id = ingredientId;
    if(l1)
        info.l1 = l1;
    if(l2)
        info.l2 = l2;
    if(l3)
        info.l3 = l3;
    if(role)
        info.role = role;
    if(role_num)
        info.role_num = role_num;
    if(description)
        info.role = description;
    if(is_warning)
        info.is_warning = is_warning;
    if(allergy)
        info.allergy = allergy;
    if(warning)
        info.warning = warning;

    Ingredient.editIngredient(info, function(err, result){
        if( err ) {
            console.log(err);
            return next(err);
        }

        res.send(result);
    })
}

module.exports = router;