const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProducaoAgricola = sequelize.define('ProducaoAgricola', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cultura: {
    type: DataTypes.STRING,
    allowNull: false
  },
  variedade: {
    type: DataTypes.STRING
  },
  areaHa: {
    type: DataTypes.FLOAT
  },
  area_plantada: {
    type: DataTypes.FLOAT
  },
  dataPlantio: {
    type: DataTypes.STRING
  },
  data_plantio: {
    type: DataTypes.DATEONLY
  },
  estagio: {
    type: DataTypes.STRING
  },
  previsaoColheita: {
    type: DataTypes.STRING
  },
  data_colheita: {
    type: DataTypes.DATEONLY
  },
  produtividadeEstimada: {
    type: DataTypes.STRING
  },
  quant_produzida: {
    type: DataTypes.FLOAT
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Em Desenvolvimento'
  },
  id_fazenda: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = ProducaoAgricola;
