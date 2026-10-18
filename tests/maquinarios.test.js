const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo de Maquinários e Frota', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let maqId;

  test('Deve listar array vazio de maquinários inicialmente', async () => {
    const res = await request(app).get('/maquinarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve cadastrar novo maquinário com sucesso', async () => {
    const res = await request(app)
      .post('/maquinarios')
      .send({
        prefixo: 'TRAT-01',
        tipo: 'Trator',
        marca: 'John Deere',
        modelo: '8R 370',
        ano: 2023,
        status: 'operacional',
        horimetro: 1250,
        combustivel: 85
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.prefixo).toBe('TRAT-01');
    maqId = res.body.id;
  });

  test('Deve listar maquinários incluindo o equipamento recém-cadastrado', async () => {
    const res = await request(app).get('/maquinarios');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].prefixo).toBe('TRAT-01');
    expect(res.body[0]).toHaveProperty('Manutencaos');
  });

  test('Deve filtrar maquinários pelo tipo', async () => {
    const resTrator = await request(app).get('/maquinarios?tipo=Trator');
    expect(resTrator.status).toBe(200);
    expect(resTrator.body.length).toBe(1);

    const resColheitadeira = await request(app).get('/maquinarios?tipo=Colheitadeira');
    expect(resColheitadeira.status).toBe(200);
    expect(resColheitadeira.body.length).toBe(0);
  });

  test('Deve buscar maquinário por ID com sucesso', async () => {
    const res = await request(app).get(`/maquinarios/${maqId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(maqId);
    expect(res.body.marca).toBe('John Deere');
  });

  test('Deve retornar 404 para maquinário inexistente por ID', async () => {
    const res = await request(app).get('/maquinarios/77777');
    expect(res.status).toBe(404);
  });

  test('Deve atualizar dados do maquinário com sucesso', async () => {
    const res = await request(app)
      .put(`/maquinarios/${maqId}`)
      .send({
        status: 'em_manutencao',
        horimetro: 1300
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('em_manutencao');
    expect(res.body.horimetro).toBe(1300);
  });

  test('Deve excluir maquinário com sucesso', async () => {
    const res = await request(app).delete(`/maquinarios/${maqId}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe('Maquinário removido com sucesso!');

    const resBusca = await request(app).get(`/maquinarios/${maqId}`);
    expect(resBusca.status).toBe(404);
  });
});
