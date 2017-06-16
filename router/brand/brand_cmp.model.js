const Sequelize = require('sequelize');
const sequelize = require('../../dbConnections/mysqlConfig');

//비교하기용 모델
let BrandCmpModel = sequelize.define('brand_cmp', {
    brand_id: {type: Sequelize.INTEGER, primaryKey: true}
    , name: {type: Sequelize.STRING, allowNull: true}
    , facility: {type: Sequelize.STRING, allowNull: true}
    , research: {type: Sequelize.STRING, allowNull: true}
    , is_recall: {type: Sequelize.STRING, allowNull: true}
    , recipe: {type: Sequelize.STRING, allowNull: true}
    , foundation: {type: Sequelize.STRING, allowNull: true}
    , image_url: {type: Sequelize.STRING}
}, {
    timestamps: false
});

//비교하기용
BrandCmpModel.getBrandByID_cmp = function(brand_id) {
    return new Promise((resolve,reject)=> {
        BrandCmpModel.findOne({
            where: {brand_id:brand_id}
        }).then((results) => {
            console.log(results);
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = BrandCmpModel;