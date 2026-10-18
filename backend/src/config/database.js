const { Sequelize } = require('sequelize');

const storagePath = process.env.DB_STORAGE || (process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false
});

module.exports = sequelize;
