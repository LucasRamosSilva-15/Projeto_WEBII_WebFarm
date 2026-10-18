const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_brinco: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  especie: {
    type: DataTypes.STRING,
    defaultValue: 'Bovino'
  },
  raca: {
    type: DataTypes.STRING
  },
  sexo: {
    type: DataTypes.STRING
  },
  data_nascimento: {
    type: DataTypes.DATEONLY
  },
  peso: {
    type: DataTypes.FLOAT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Saudável'
  },
  origem: {
    type: DataTypes.STRING
  },
  data_aquisicao: {
    type: DataTypes.DATEONLY
  },
  id_fazenda: {
    type: DataTypes.INTEGER
  }
});

module.exports = Animal;
