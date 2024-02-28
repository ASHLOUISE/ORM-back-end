const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, 'root', process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      port: 3306
    });

module.exports = sequelize;