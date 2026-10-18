const request = require('supertest');
const app = require('../backend/src/app');
const sequelize = require('../backend/src/config/database');

describe('Módulo de Histórico e Auditoria de Atividades', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  let logId;

  test('Deve listar array vazio de histórico inicialmente', async () => {
    const res = await request(app).get('/historico');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('Deve criar novo registro no histórico com protocolo automático', async () => {
    const res = await request(app)
      .post('/historico')
      .send({
        modulo: 'Pecuária',
        acao: 'Vacinação em Lote',
        detalhes: 'Aplicação de vacina contra aftosa no lote 01',
        responsavel: 'Dr. Roberto Veterinário',
        tipo_evento: 'geral'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('protocolo');
    expect(res.body.protocolo).toContain('WF-PEC-');
    logId = res.body.id;
  });

  test('Deve falhar ao tentar registrar sem campos obrigatórios', async () => {
    const res = await request(app)
      .post('/historico')
      .send({
        responsavel: 'Sem modulo e acao'
      });

    expect(res.status).toBe(400);
    expect(res.body.mensagem).toContain('obrigatórios');
  });

  test('Deve filtrar histórico pelo módulo', async () => {
    const resPec = await request(app).get('/historico?modulo=Pecuária');
    expect(resPec.status).toBe(200);
    expect(resPec.body.length).toBe(1);

    const resFin = await request(app).get('/historico?modulo=Financeiro');
    expect(resFin.status).toBe(200);
    expect(resFin.body.length).toBe(0);
  });

  test('Deve filtrar histórico por termo de busca', async () => {
    const resTermo = await request(app).get('/historico?termo=Roberto');
    expect(resTermo.status).toBe(200);
    expect(resTermo.body.length).toBe(1);

    const resInexistente = await request(app).get('/historico?termo=TextoInexistente');
    expect(resInexistente.status).toBe(200);
    expect(resInexistente.body.length).toBe(0);
  });

  test('Deve excluir registro do histórico com sucesso', async () => {
    const res = await request(app).delete(`/historico/${logId}`);
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBe('Registro removido com sucesso!');

    const resList = await request(app).get('/historico');
    expect(resList.body.length).toBe(0);
  });
});
