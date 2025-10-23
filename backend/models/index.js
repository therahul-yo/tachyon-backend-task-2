const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFile,
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Task = require('./task')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

// Define associations
db.User.hasMany(db.Task, { foreignKey: 'userId', as: 'tasks' });
db.Task.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

module.exports = db;
