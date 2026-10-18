const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo Financeiro e Transações', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let transEntradaId;
  let transSaidaId;

  test('Deve listar array vazio de transações inicialmente', async () => {
    const res = await request(app).get('/transacoes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve cadastrar transação de entrada (receita) com sucesso', async () => {
    const res = await request(app)
      .post('/transacoes')
      .send({
        tipo: 'entrada',
        categoria: 'Venda de Soja',
        descricao: 'Venda de 500 sacas de soja contrato futuro',
        valor: 65000,
        data: '2026-10-18',
        comprovante: 'NF-89211'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.tipo).toBe('entrada');
    expect(res.body.valor).toBe(65000);
    transEntradaId = res.body.id;
  });

  test('Deve cadastrar transação de saída (despesa) com sucesso', async () => {
    const res = await request(app)
      .post('/transacoes')
      .send({
        tipo: 'saida',
        categoria: 'Insumos',
        descricao: 'Compra de defensivos e adubo formulado',
        valor: 22000,
        data: '2026-10-18',
        comprovante: 'NF-44321'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.tipo).toBe('saida');
    expect(res.body.valor).toBe(22000);
    transSaidaId = res.body.id;
  });

  test('Deve listar todas as transações cadastradas', async () => {
    const res = await request(app).get('/transacoes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('Deve filtrar transações pelo tipo entrada', async () => {
    const res = await request(app).get('/transacoes?tipo=entrada');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].categoria).toBe('Venda de Soja');
  });

  test('Deve filtrar transações pelo tipo saida', async () => {
    const res = await request(app).get('/transacoes?tipo=saida');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].categoria).toBe('Insumos');
  });

  test('Deve buscar transação por ID com sucesso', async () => {
    const res = await request(app).get(`/transacoes/${transEntradaId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(transEntradaId);
    expect(res.body.comprovante).toBe('NF-89211');
  });

  test('Deve atualizar dados da transação com sucesso', async () => {
    const res = await request(app)
      .put(`/transacoes/${transEntradaId}`)
      .send({
        descricao: 'Venda de 500 sacas de soja liquidação à vista'
      });

    expect(res.status).toBe(200);
    expect(res.body.descricao).toContain('liquidação à vista');
  });

  test('Deve excluir transação com sucesso', async () => {
    const res = await request(app).delete(`/transacoes/${transSaidaId}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe('Transação removida com sucesso!');

    const resBusca = await request(app).get(`/transacoes/${transSaidaId}`);
    expect(resBusca.status).toBe(404);
  });
});
