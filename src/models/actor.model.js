const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Actor = sequelize.define('Actor', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName:  { type: DataTypes.STRING, allowNull: false }
});

module.exports = Actor;
