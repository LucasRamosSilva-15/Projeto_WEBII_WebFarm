const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo de Funcionários e Gestão de Equipe', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let funcId;

  test('Deve listar array vazio de colaboradores inicialmente', async () => {
    const res = await request(app).get('/funcionarios');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve cadastrar um novo funcionário com sucesso', async () => {
    const res = await request(app)
      .post('/funcionarios')
      .send({
        nome: 'Marcos Vinicius',
        cpf: '321.654.987-11',
        funcao: 'Tratorista Especialista',
        salario: 3800,
        status: 'ativo',
        email: 'marcos@webfarm.com'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Marcos Vinicius');
    funcId = res.body.id;
  });

  test('Deve listar funcionários incluindo o recém-cadastrado', async () => {
    const res = await request(app).get('/funcionarios');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nome).toBe('Marcos Vinicius');
  });

  test('Deve filtrar funcionário pelo parâmetro de busca', async () => {
    const res = await request(app).get('/funcionarios?busca=Marcos');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);

    const resInexistente = await request(app).get('/funcionarios?busca=Inexistente');
    expect(resInexistente.status).toBe(200);
    expect(resInexistente.body.length).toBe(0);
  });

  test('Deve buscar funcionário por ID com sucesso', async () => {
    const res = await request(app).get(`/funcionarios/${funcId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(funcId);
    expect(res.body.funcao).toBe('Tratorista Especialista');
  });

  test('Deve retornar 404 para funcionário não encontrado por ID', async () => {
    const res = await request(app).get('/funcionarios/88888');
    expect(res.status).toBe(404);
  });

  test('Deve atualizar dados do funcionário com sucesso', async () => {
    const res = await request(app)
      .put(`/funcionarios/${funcId}`)
      .send({
        salario: 4200,
        status: 'ferias'
      });

    expect(res.status).toBe(200);
    expect(res.body.salario).toBe(4200);
    expect(res.body.status).toBe('ferias');
  });

  test('Deve excluir o funcionário com sucesso', async () => {
    const res = await request(app).delete(`/funcionarios/${funcId}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe('Funcionário removido com sucesso!');

    const resBusca = await request(app).get(`/funcionarios/${funcId}`);
    expect(resBusca.status).toBe(404);
  });
});
