const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo de Fornecedores, Veículos, Manutenções e Vacinações', () => {
  let fazendaId;
  let fornecedorId;
  let veiculoId;
  let animalId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    const resAuth = await request(app)
      .post('/auth/register')
      .send({
        nome: 'Produtor Modelos Extras',
        cpf_cnpj: '999.000.111-22',
        email: 'modelosextras@webfarm.com',
        senha: 'senha123',
        nome_fazenda: 'Fazenda Modelo Extras'
      });
    fazendaId = resAuth.body.usuario.id_fazenda;
  });

  test('Deve cadastrar fornecedor com sucesso', async () => {
    const res = await request(app)
      .post('/fornecedores')
      .send({
        nome: 'AgroInsumos Distribuidora Ltda',
        cpf_cnpj: '12.345.678/0001-90',
        cell: '(11) 3322-4455',
        email: 'contato@agroinsumos.com',
        id_fazenda: fazendaId
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('AgroInsumos Distribuidora Ltda');
    fornecedorId = res.body.id;
  });

  test('Deve listar fornecedores cadastrados', async () => {
    const res = await request(app).get('/fornecedores');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nome).toBe('AgroInsumos Distribuidora Ltda');
  });

  test('Deve cadastrar veículo utilitário com sucesso', async () => {
    const res = await request(app)
      .post('/veiculos')
      .send({
        tipo: 'Caminhonete',
        marca: 'Toyota',
        modelo: 'Hilux SRX',
        ano: 2024,
        placa: 'WBF-2026',
        status: 'ativo',
        id_fazenda: fazendaId
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.placa).toBe('WBF-2026');
    veiculoId = res.body.id;
  });

  test('Deve listar veículos cadastrados com associação a manutenções', async () => {
    const res = await request(app).get('/veiculos');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('Manutencaos');
  });

  test('Deve cadastrar manutenção vinculada ao veículo', async () => {
    const res = await request(app)
      .post('/manutencoes')
      .send({
        tipo: 'Preventiva',
        descricao: 'Troca de óleo e filtro de ar',
        data: '2026-10-18',
        valor: 1200,
        status: 'concluida',
        id_veiculo: veiculoId
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(Number(res.body.valor)).toBe(1200);
  });

  test('Deve listar manutenções cadastradas com associações', async () => {
    const res = await request(app).get('/manutencoes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].Veiculo.placa).toBe('WBF-2026');
  });

  test('Deve cadastrar vacinação para um animal', async () => {
    const resAnimal = await request(app)
      .post('/animais')
      .send({
        codigo_brinco: 'VAC-01',
        especie: 'Bovino',
        raca: 'Nelore',
        peso: 350,
        status: 'saudavel',
        id_fazenda: fazendaId
      });

    animalId = resAnimal.body.id;

    const res = await request(app)
      .post('/vacinacoes')
      .send({
        id_animal: animalId,
        nome_vacina: 'Febre Aftosa',
        data_aplicacao: '2026-10-18',
        dose: '2ml',
        responsavel: 'Veterinário de Campo'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nome_vacina).toBe('Febre Aftosa');
  });

  test('Deve listar vacinações com dados do animal incluídos', async () => {
    const res = await request(app).get('/vacinacoes');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].Animal.codigo_brinco).toBe('VAC-01');
  });
});
