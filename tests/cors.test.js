const request = require('supertest');
const app = require('../backend/src/app');

describe('Configuração de CORS e Requisições Preflight', () => {
  it('deve responder à requisição preflight OPTIONS com os cabeçalhos de CORS corretos para a Vercel', async () => {
    const response = await request(app)
      .options('/auth/login')
      .set('Origin', 'https://projeto-webii-web-farm.vercel.app')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('https://projeto-webii-web-farm.vercel.app');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('deve responder a requisições POST normais com o cabeçalho Access-Control-Allow-Origin', async () => {
    const response = await request(app)
      .post('/auth/login')
      .set('Origin', 'https://projeto-webii-web-farm.vercel.app')
      .send({ email: 'emailinvalido@teste.com', senha: '123' });

    expect(response.headers['access-control-allow-origin']).toBe('https://projeto-webii-web-farm.vercel.app');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('deve aceitar subdomínios e previews da Vercel', async () => {
    const response = await request(app)
      .options('/animais')
      .set('Origin', 'https://projeto-webii-web-farm-git-feature-preview.vercel.app')
      .set('Access-Control-Request-Method', 'GET');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('https://projeto-webii-web-farm-git-feature-preview.vercel.app');
  });
});
