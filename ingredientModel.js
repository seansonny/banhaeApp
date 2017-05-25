var pool = require('./mysqlConnection');

class Ingredient {
}

Ingredient.getIngredientDetail = function(ingredientId, sendCb) {
    pool.getConnection(function(err, conn) {
        if ( err ){
            return sendCb(err);
        }

        var sql = 'SELECT l1, l2, role, role_num, ' +
            'description, allergy, allergy_num, ' +
            'warning, is_warning FROM ingredient ' +
            'WHERE ingredient_id = '
        + ingredientId;

        conn.query(sql, function(err, results){
            if ( err ) {
                return sendCb(err);
            }

            conn.release();
            return sendCb(null, {count : results.length, data : results});
        })
    })
}

module.exports = Ingredient;
