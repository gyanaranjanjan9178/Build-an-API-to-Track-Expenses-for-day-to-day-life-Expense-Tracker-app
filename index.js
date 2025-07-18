const sequelize = require('../config/db');
const User = require('./user');
const Expense = require('./expense');

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports = { sequelize, User, Expense };