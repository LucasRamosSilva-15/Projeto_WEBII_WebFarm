const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo de Animais e Pecuária', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let animalId;

  test('Deve listar array vazio de animais inicialmente', async () => {
    const res = await request(app).get('/animais');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve cadastrar um novo animal com sucesso', async () => {
    const res = await request(app)
      .post('/animais')
      .send({
        codigo_brinco: 'BOV-2026',
        especie: 'Bovino',
        raca: 'Nelore',
        peso: 520,
        status: 'saudavel',
        origem: 'Nascido na Fazenda'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.codigo_brinco).toBe('BOV-2026');
    animalId = res.body.id;
  });

  test('Deve listar os animais incluindo o recém-cadastrado', async () => {
    const res = await request(app).get('/animais');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].codigo_brinco).toBe('BOV-2026');
    expect(res.body[0]).toHaveProperty('VacinacaoAnimals');
  });

  test('Deve buscar animal por ID com sucesso', async () => {
    const res = await request(app).get(`/animais/${animalId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(animalId);
    expect(res.body.raca).toBe('Nelore');
  });

  test('Deve retornar 404 para animal não encontrado por ID', async () => {
    const res = await request(app).get('/animais/99999');
    expect(res.status).toBe(404);
    expect(res.body.mensagem).toBe('Animal não encontrado.');
  });

  test('Deve atualizar dados do animal com sucesso', async () => {
    const res = await request(app)
      .put(`/animais/${animalId}`)
      .send({
        peso: 545,
        status: 'em_tratamento'
      });

    expect(res.status).toBe(200);
    expect(res.body.peso).toBe(545);
    expect(res.body.status).toBe('em_tratamento');
  });

  test('Deve retornar 404 ao tentar atualizar animal inexistente', async () => {
    const res = await request(app)
      .put('/animais/99999')
      .send({ peso: 600 });

    expect(res.status).toBe(404);
  });

  test('Deve excluir o animal com sucesso', async () => {
    const res = await request(app).delete(`/animais/${animalId}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe('Animal removido com sucesso!');

    const resBusca = await request(app).get(`/animais/${animalId}`);
    expect(resBusca.status).toBe(404);
  });

  test('Deve retornar 404 ao tentar excluir animal inexistente', async () => {
    const res = await request(app).delete('/animais/99999');
    expect(res.status).toBe(404);
  });
});
