const request = require('supertest');
const app = require('../src/server');

describe('Testes da API', () => {
  test('Deve retornar dados climáticos para cidade válida', async () => {
    const response = await request(app).get('/api/v1/clima/Fortaleza');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('nome');
    expect(response.body).toHaveProperty('estado');
    expect(response.body).toHaveProperty('clima');
  });

  test('Deve retornar erro para cidade não encontrada', async () => {
    const response = await request(app).get('/api/v1/clima/cidadeinventada');

    expect(response.statusCode).toBe(404);
    expect(response.body.codigo).toBe('CIDADE_NAO_ENCONTRADA');
  });
});