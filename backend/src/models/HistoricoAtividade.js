const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistoricoAtividade = sequelize.define('HistoricoAtividade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_fazenda: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  acao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  detalhes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  responsavel: {
    type: DataTypes.STRING,
    defaultValue: 'Administrador WebFarm'
  },
  protocolo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_evento: {
    type: DataTypes.STRING,
    defaultValue: 'geral'
  },
  data: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'historico_atividades',
  timestamps: true
});

module.exports = HistoricoAtividade;
