var pool = require('../../dbConnections/mysqlConnection');

class Ingredient {
}

Ingredient.getIngredientDetail = function(ingredientId, sendCb) {
    pool.getConnection(function(err, conn) {
        if ( err ){
            return sendCb(err);
        }

        // var sql = 'SELECT l1, l2, role, role_num, ' +
        //     'description, allergy, allergy_num, ' +
        //     'warning, is_warning FROM ingredient ' +
        //     'WHERE ingredient_id = '
        // + ingredientId; //sql injection 취약
        var sql = 'SELECT l1, l2, role, role_num, ' +
            'description, allergy, allergy_num, ' +
            'warning, is_warning FROM ingredient ' +
            'WHERE ingredient_id = ?'

        conn.query(sql, ingredientId, function(err, results){
            if ( err ) {
                conn.release();
                return sendCb(err);
            }

            conn.release();
            return sendCb(null, {count : results.length, data : results});
        })
    })
}

Ingredient.deleteIngredient = function(ingredientId, sendCb){
    pool.getConnection(function(err, conn) {
        if( err ) {
            return sendCb(err);
        }

        var sql = 'DELETE FROM ingredient WHERE ingredient_id = ?';
        conn.query(sql, ingredientId, function(err, results){
            if ( err ) {
                //conn.rollback();
                conn.release();
                err.code = 500;
                return sendCb(err);
            }

            //conn.commit();
            conn.release();
            return sendCb(null, { msg: 'Ingredient_id: '+ ingredientId + ' is sucessfully deleted'});
        })
    })
}

Ingredient.addIngredient = function(info, sendCb){
    pool.getConnection(function(err, conn) {
        if( err ) {
            return sendCb(err);
        }

        var sql = 'INSERT INTO ingredient SET ?';
        conn.query(sql, info, function(err, results) {
            if (err) {
                err.code = 500;
                conn.release();
                return sendCb(err);
            }
            const ingredient_id = info["ingredient_Id"];
            //console.log(info);
            conn.release();
            return sendCb(null, { msg: "Ingredient_id: " + ingredient_id  +" is added successfully"});
        })
    })
}

Ingredient.editIngredient = function(info, sendCb){
    pool.getConnection(function(err, conn){
        if( err ){
            return sendCb(err);
        }
        const ingredient_id = info.ingredient_Id;
        var sql = 'UPDATE ingredient SET ?  WHERE ingredient_id = ?';
        conn.query(sql, [info,ingredient_id], function(err, results) {
            if(err) {
                err.code = 500;
                conn.release();
                return sendCb(err);
            }
            conn.release();
            return sendCb(null, { msg : "Ingredient_id: " + ingredient_id  +' is edited successfully'})
        })
    })
}

module.exports = Ingredient;