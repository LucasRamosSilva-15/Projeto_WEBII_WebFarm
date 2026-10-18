const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo de Produção Agrícola e Safra', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let prodId;

  test('Deve listar array vazio de talhões inicialmente', async () => {
    const res = await request(app).get('/producoes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve cadastrar um novo talhão com sucesso', async () => {
    const res = await request(app)
      .post('/producoes')
      .send({
        nome: 'Talhão Sul 01',
        cultura: 'Soja',
        variedade: 'TMG 7062',
        areaHa: 120,
        status: 'plantio',
        dataPlantio: '2026-10-15',
        previsaoColheita: '2027-02-28',
        produtividadeEstimada: '68 sc/ha'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Talhão Sul 01');
    prodId = res.body.id;
  });

  test('Deve listar as produções incluindo o talhão cadastrado', async () => {
    const res = await request(app).get('/producoes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].cultura).toBe('Soja');
  });

  test('Deve filtrar produções pela cultura', async () => {
    const resSoja = await request(app).get('/producoes?cultura=Soja');
    expect(resSoja.status).toBe(200);
    expect(resSoja.body.length).toBe(1);

    const resMilho = await request(app).get('/producoes?cultura=Milho');
    expect(resMilho.status).toBe(200);
    expect(resMilho.body.length).toBe(0);
  });

  test('Deve buscar talhão por ID com sucesso', async () => {
    const res = await request(app).get(`/producoes/${prodId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(prodId);
    expect(res.body.variedade).toBe('TMG 7062');
  });

  test('Deve retornar 404 para talhão inexistente por ID', async () => {
    const res = await request(app).get('/producoes/66666');
    expect(res.status).toBe(404);
  });

  test('Deve atualizar dados do talhão com sucesso', async () => {
    const res = await request(app)
      .put(`/producoes/${prodId}`)
      .send({
        status: 'vegetativo',
        produtividadeEstimada: '72 sc/ha'
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('vegetativo');
    expect(res.body.produtividadeEstimada).toBe('72 sc/ha');
  });

  test('Deve excluir o talhão agrícola com sucesso', async () => {
    const res = await request(app).delete(`/producoes/${prodId}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe('Talhão/produção removido com sucesso!');

    const resBusca = await request(app).get(`/producoes/${prodId}`);
    expect(resBusca.status).toBe(404);
  });
});
