const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo do Dashboard e Métricas Consolidadas', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  test('Deve retornar métricas zeradas em banco de dados limpo', async () => {
    const res = await request(app).get('/dashboard/metricas');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      animais: 0,
      maquinas: 0,
      funcionarios: 0,
      talhoes: 0,
      financeiro: {
        totalEntradas: 0,
        totalSaidas: 0,
        saldoLiquido: 0
      }
    });
  });

  test('Deve atualizar contagem de animais ao cadastrar um animal', async () => {
    await request(app)
      .post('/animais')
      .send({
        codigo_brinco: 'DASH-01',
        especie: 'Bovino',
        raca: 'Angus',
        peso: 480,
        status: 'saudavel'
      });

    const res = await request(app).get('/dashboard/metricas');
    expect(res.status).toBe(200);
    expect(res.body.animais).toBe(1);
  });

  test('Deve atualizar contagem de máquinas ao cadastrar um maquinário', async () => {
    await request(app)
      .post('/maquinarios')
      .send({
        prefixo: 'DASH-TRAT',
        tipo: 'Trator',
        marca: 'Valtra',
        modelo: 'A94',
        status: 'operacional'
      });

    const res = await request(app).get('/dashboard/metricas');
    expect(res.status).toBe(200);
    expect(res.body.maquinas).toBe(1);
  });

  test('Deve atualizar contagem de funcionários ao cadastrar colaborador', async () => {
    await request(app)
      .post('/funcionarios')
      .send({
        nome: 'Joao Silva',
        cpf: '000.111.222-33',
        funcao: 'Agrônomo',
        salario: 6500,
        status: 'ativo'
      });

    const res = await request(app).get('/dashboard/metricas');
    expect(res.status).toBe(200);
    expect(res.body.funcionarios).toBe(1);
  });

  test('Deve atualizar contagem de talhões ao cadastrar uma produção agrícola', async () => {
    await request(app)
      .post('/producoes')
      .send({
        nome: 'Talhão Dashboard',
        cultura: 'Milho',
        areaHa: 80,
        status: 'crescimento'
      });

    const res = await request(app).get('/dashboard/metricas');
    expect(res.status).toBe(200);
    expect(res.body.talhoes).toBe(1);
  });

  test('Deve calcular corretamente receitas, despesas e saldo líquido consolidado', async () => {
    await request(app)
      .post('/transacoes')
      .send({
        tipo: 'entrada',
        categoria: 'Venda de Grãos',
        descricao: 'Venda de safra',
        valor: 100000
      });

    await request(app)
      .post('/transacoes')
      .send({
        tipo: 'saida',
        categoria: 'Combustível',
        descricao: 'Diesel S10',
        valor: 35000
      });

    const res = await request(app).get('/dashboard/metricas');
    expect(res.status).toBe(200);
    expect(res.body.financeiro.totalEntradas).toBe(100000);
    expect(res.body.financeiro.totalSaidas).toBe(35000);
    expect(res.body.financeiro.saldoLiquido).toBe(65000);
  });
});
