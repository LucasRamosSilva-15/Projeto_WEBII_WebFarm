const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo de Fazendas e Produtores Rurais', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let produtorId;
  let fazendaId;

  test('Deve listar array vazio de produtores inicialmente', async () => {
    const res = await request(app).get('/produtores');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve cadastrar produtor rural diretamente na rota /produtores', async () => {
    const res = await request(app)
      .post('/produtores')
      .send({
        nome: 'Juliana Mendes',
        cpf_cnpj: '789.654.123-99',
        tipo_pessoa: 'fisica',
        email: 'juliana@webfarm.com'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Juliana Mendes');
    produtorId = res.body.id;
  });

  test('Deve buscar produtor por ID com sucesso', async () => {
    const res = await request(app).get(`/produtores/${produtorId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(produtorId);
    expect(res.body).toHaveProperty('Fazendas');
  });

  test('Deve atualizar dados do produtor rural', async () => {
    const res = await request(app)
      .put(`/produtores/${produtorId}`)
      .send({
        cell: '(65) 99887-6655'
      });

    expect(res.status).toBe(200);
    expect(res.body.cell).toBe('(65) 99887-6655');
  });

  test('Deve cadastrar uma nova fazenda vinculada ao produtor', async () => {
    const res = await request(app)
      .post('/fazendas')
      .send({
        nome: 'Fazenda Santa Maria',
        id_produtor: produtorId
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Fazenda Santa Maria');
    fazendaId = res.body.id;
  });

  test('Deve listar as fazendas incluindo a recém-criada', async () => {
    const res = await request(app).get('/fazendas');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nome).toBe('Fazenda Santa Maria');
    expect(res.body[0].ProdutorRural.nome).toBe('Juliana Mendes');
  });

  test('Deve buscar fazenda por ID com associações completas', async () => {
    const res = await request(app).get(`/fazendas/${fazendaId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(fazendaId);
    expect(res.body).toHaveProperty('Animals');
    expect(res.body).toHaveProperty('Funcionarios');
    expect(res.body).toHaveProperty('Maquinarios');
    expect(res.body).toHaveProperty('ProducaoAgricolas');
  });

  test('Deve atualizar nome da fazenda com sucesso', async () => {
    const res = await request(app)
      .put(`/fazendas/${fazendaId}`)
      .send({
        nome: 'Fazenda Santa Maria do Araguaia'
      });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe('Fazenda Santa Maria do Araguaia');
  });
});
