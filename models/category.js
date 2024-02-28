const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init({

}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'category',
});


module.exports = Category;