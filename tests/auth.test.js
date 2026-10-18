const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Autenticação e Registro de Produtores', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  const produtorValido = {
    nome: 'Carlos Eduardo',
    cpf_cnpj: '123.456.789-00',
    email: 'carlos@webfarm.com',
    senha: 'senhaSegura123',
    nome_fazenda: 'Fazenda Boa Esperança',
    tipo_pessoa: 'fisica',
    cell: '(11) 98765-4321'
  };

  test('Deve registrar um novo produtor com dados válidos', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(produtorValido);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('mensagem', 'Cadastro realizado com sucesso!');
    expect(res.body.usuario).toHaveProperty('email', 'carlos@webfarm.com');
    expect(res.body.usuario).toHaveProperty('fazenda', 'Fazenda Boa Esperança');
    expect(res.body.usuario).toHaveProperty('id');
  });

  test('Não deve registrar produtor com email já existente', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        ...produtorValido,
        cpf_cnpj: '999.888.777-66'
      });

    expect(res.status).toBe(409);
    expect(res.body.mensagem).toContain('Já existe um produtor');
  });

  test('Não deve registrar produtor com CPF/CNPJ já existente', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        ...produtorValido,
        email: 'outro@webfarm.com'
      });

    expect(res.status).toBe(409);
    expect(res.body.mensagem).toContain('Já existe um produtor');
  });

  test('Não deve registrar sem nome', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        cpf_cnpj: '111.222.333-44',
        email: 'semnome@webfarm.com',
        senha: '123'
      });

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toContain('obrigatórios');
  });

  test('Não deve registrar sem senha', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Usuario Sem Senha',
        cpf_cnpj: '111.222.333-55',
        email: 'semsenha@webfarm.com'
      });

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toContain('obrigatórios');
  });

  test('Deve realizar login com e-mail e senha corretos', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        identificador: 'carlos@webfarm.com',
        senha: 'senhaSegura123'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('mensagem', 'Login realizado com sucesso!');
    expect(res.body.usuario.nome).toBe('Carlos Eduardo');
  });

  test('Deve realizar login com CPF/CNPJ e senha corretos', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        identificador: '123.456.789-00',
        senha: 'senhaSegura123'
      });

    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe('carlos@webfarm.com');
  });

  test('Não deve logar com senha incorreta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        identificador: 'carlos@webfarm.com',
        senha: 'senhaErrada'
      });

    expect(res.status).toBe(401);
    expect(res.body.mensagem).toContain('Senha incorreta');
  });

  test('Não deve logar com usuário inexistente', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        identificador: 'inexistente@webfarm.com',
        senha: 'qualquersenha'
      });

    expect(res.status).toBe(401);
    expect(res.body.mensagem).toContain('Usuário não encontrado');
  });
});
