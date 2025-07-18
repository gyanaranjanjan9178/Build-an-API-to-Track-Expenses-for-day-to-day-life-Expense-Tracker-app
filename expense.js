const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
  title: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  date: DataTypes.DATE,
  category: DataTypes.STRING,
  note: DataTypes.TEXT,
  imageUrl: DataTypes.STRING,
});

module.exports = Expense;