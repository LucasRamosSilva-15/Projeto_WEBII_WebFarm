const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TransacaoFinanceira = sequelize.define('TransacaoFinanceira', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  comprovante: {
    type: DataTypes.STRING
  },
  id_fazenda: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = TransacaoFinanceira;
