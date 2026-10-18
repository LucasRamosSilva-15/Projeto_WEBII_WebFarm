const request = require('supertest');
const app = require('../backend/src/app');

describe('Documentação Swagger e OpenAPI', () => {
  it('deve disponibilizar o endpoint de especificação JSON em /api-docs.json', async () => {
    const res = await request(app).get('/api-docs.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi', '3.0.0');
    expect(res.body.info).toHaveProperty('title');
    expect(res.body.paths).toHaveProperty('/auth/login');
    expect(res.body.paths).toHaveProperty('/dashboard/metricas');
    expect(res.body.paths).toHaveProperty('/animais');
    expect(res.body.paths).toHaveProperty('/maquinarios');
    expect(res.body.paths).toHaveProperty('/producoes');
    expect(res.body.paths).toHaveProperty('/transacoes');
    expect(res.body.paths).toHaveProperty('/fazendas');
    expect(res.body.paths).toHaveProperty('/produtores');
    expect(res.body.paths).toHaveProperty('/produtores/{id}');
  });

  it('deve carregar a interface interativa do Swagger UI em /api-docs', async () => {
    const res = await request(app).get('/api-docs/');
    expect([200, 301, 302]).toContain(res.status);
  });
});
