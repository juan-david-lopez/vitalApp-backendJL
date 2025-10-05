const request = require('supertest');
const app = require('../../server.js');

describe('Health Check Endpoints', () => {
  test('GET /health should return healthy status', async () => {
    const res = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('timestamp');
  });

  test('GET /ready should return ready status', async () => {
    const res = await request(app)
      .get('/ready')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'ready');
  });
});