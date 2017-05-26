const Sequelize = require('sequelize');
const sequelize = require('../../database/mysqlConfig');

let brand = sequelize.define('brand', {
    brand_id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}
    , name: {type: Sequelize.STRING}
    , company: {type: Sequelize.TEXT, allowNull: true}
    , facility: {type: Sequelize.TEXT, allowNull: true}
    , research: {type: Sequelize.STRING, allowNull: true}
    , is_recall: {type: Sequelize.BOOLEAN, allowNull: true}
    , recipe: {type: Sequelize.STRING, allowNull: true}
    , foundation: {type: Sequelize.STRING, allowNull: true}
    , recall: {type: Sequelize.TEXT, allowNull: true}
}, {
        timestamps: false
});

module.exports = brand;