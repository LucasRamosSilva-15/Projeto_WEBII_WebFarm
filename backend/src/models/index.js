const Animal = require('./Animal');
const Fazenda = require('./Fazenda');
const Fornecedor = require('./Fornecedor');
const Funcionario = require('./Funcionario');
const Manutencao = require('./Manutencao');
const Maquinario = require('./Maquinario');
const ProducaoAgricola = require('./ProducaoAgricola');
const ProdutorRural = require('./ProdutorRural');
const Veiculo = require('./Veiculo');
const VacinacaoAnimal = require('./VacinacaoAnimal');
const TransacaoFinanceira = require('./TransacaoFinanceira');
const HistoricoAtividade = require('./HistoricoAtividade');

ProdutorRural.hasMany(Fazenda, {
  foreignKey: 'id_produtor'
});

Fazenda.belongsTo(ProdutorRural, {
  foreignKey: 'id_produtor'
});

Fazenda.hasMany(Animal, {
  foreignKey: 'id_fazenda'
});

Animal.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

Fazenda.hasMany(Funcionario, {
  foreignKey: 'id_fazenda'
});

Funcionario.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

Fazenda.hasMany(Maquinario, {
  foreignKey: 'id_fazenda'
});

Maquinario.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

Fazenda.hasMany(Veiculo, {
  foreignKey: 'id_fazenda'
});

Veiculo.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

Fazenda.hasMany(ProducaoAgricola, {
  foreignKey: 'id_fazenda'
});

ProducaoAgricola.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

Fazenda.hasMany(Fornecedor, {
  foreignKey: 'id_fazenda'
});

Fornecedor.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

Fazenda.hasMany(TransacaoFinanceira, {
  foreignKey: 'id_fazenda'
});

TransacaoFinanceira.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

Animal.hasMany(VacinacaoAnimal, {
  foreignKey: 'id_animal'
});

VacinacaoAnimal.belongsTo(Animal, {
  foreignKey: 'id_animal'
});

Maquinario.hasMany(Manutencao, {
  foreignKey: 'id_equipamento'
});

Manutencao.belongsTo(Maquinario, {
  foreignKey: 'id_equipamento'
});

Veiculo.hasMany(Manutencao, {
  foreignKey: 'id_veiculo'
});

Manutencao.belongsTo(Veiculo, {
  foreignKey: 'id_veiculo'
});

Fazenda.hasMany(HistoricoAtividade, {
  foreignKey: 'id_fazenda'
});

HistoricoAtividade.belongsTo(Fazenda, {
  foreignKey: 'id_fazenda'
});

module.exports = {
  Animal,
  Fazenda,
  Fornecedor,
  Funcionario,
  Manutencao,
  Maquinario,
  ProducaoAgricola,
  ProdutorRural,
  Veiculo,
  VacinacaoAnimal,
  TransacaoFinanceira,
  HistoricoAtividade
};
