const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funcionario = sequelize.define('Funcionario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  endereco: {
    type: DataTypes.STRING
  },
  data_admissao: {
    type: DataTypes.DATEONLY
  },
  sexo: {
    type: DataTypes.STRING
  },
  funcao: {
    type: DataTypes.STRING
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2)
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Ativo'
  },
  id_fazenda: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = Funcionario;
