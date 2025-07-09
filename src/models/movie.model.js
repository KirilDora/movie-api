const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  format: { type: DataTypes.ENUM('VHS', 'DVD', 'Blu-Ray'), allowNull: false }
});

module.exports = Movie;
