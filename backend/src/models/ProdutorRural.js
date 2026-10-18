const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProdutorRural = sequelize.define('ProdutorRural', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf_cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tipo_pessoa: {
    type: DataTypes.STRING
  },
  data_nascimento: {
    type: DataTypes.DATEONLY
  },
  cell: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  senha: {
    type: DataTypes.STRING
  },
  endereco: {
    type: DataTypes.STRING
  },
  data_cadastro: {
    type: DataTypes.DATEONLY
  },
  sexo: {
    type: DataTypes.STRING
  }
});

module.exports = ProdutorRural;
