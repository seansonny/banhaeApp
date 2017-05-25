/**
 * Created by sswpro on 2017-05-25.
 */
const express = require('express');
const fs = require('fs');
const Ingredient = require('../ingredientModel');
//const bodyParser = require('body-parser'); 배열로 받을 거라 필요 없음

var router = express.Router();

//router.use(bodyParser.json({}));

router.route('/ingredients/:ingredient_id')
    .get(showIngredientDetail)
    .delete(deleteIngredient)
    .put(editIngredient);

//router.get('ingredients', showIngredientLists);
// function showIngredientLists (req, res) {
//     const ingredientLists = ingredientModel.getIngredientLists();
//     const result = {data:ingredientLists, count:ingredientLists.length};
//     res.send(result);
// }

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
    res.sendStatus(501); // Not implemented
}

function editIngredient(req, res) {
    res.sendStatus(501); // Not implemented
}

module.exports = router;