/**
 * Created by sswpro on 2017-05-25.
 */
const express = require('express');
const fs = require('fs');
const Ingredient = require('../ingredientModel');
const bodyParser = require('body-parser');

var router = express.Router();

//router.use(bodyParser.json({}));

router.route('/ingredients/:ingredient_id')
    .get(showIngredientDetail)
    .delete(deleteIngredient)
    .post(addIngredeint)
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
    const ingredientId = req.params.ingredient_id;
    console.log('ingredient_id: ', ingredientId);

    Ingredient.deleteIngredient(ingredientId, function(err, result){
        if ( err ){
            console.log(err);
            return next(err);
        }

        res.send(result);
    })
}

function addIngredeint(req, res) {
    var ingredientsArray = req.body;

}

function editIngredient(req, res) {
    res.sendStatus(501); // Not implemented
}

module.exports = router;