const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Maquinario = sequelize.define('Maquinario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: true
  },
  prefixo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING
  },
  marca: {
    type: DataTypes.STRING
  },
  modelo: {
    type: DataTypes.STRING
  },
  ano: {
    type: DataTypes.STRING
  },
  ano_fabricacao: {
    type: DataTypes.INTEGER
  },
  horimetro: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Operando'
  },
  operador: {
    type: DataTypes.STRING
  },
  ultimaRevisao: {
    type: DataTypes.STRING
  },
  proximaRevisao: {
    type: DataTypes.STRING
  },
  data_aquisicao: {
    type: DataTypes.DATEONLY
  },
  valor_aquisicao: {
    type: DataTypes.DECIMAL(10, 2)
  },
  id_fazenda: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = Maquinario;
