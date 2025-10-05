const request = require('supertest');
const app = require('../../server');
let server;

describe('Health Check Endpoints', () => {
  beforeEach(async () => {
    app.clearDB();
    server = app.listen(4000);
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(server)
        .get('/health')
        .expect(200);

      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /ready', () => {
    it('should return ready status', async () => {
      const res = await request(server)
        .get('/ready')
        .expect(200);

      expect(res.body.status).toBe('ready');
      expect(res.body.database).toBe('connected');
      expect(res.body.cache).toBe('connected');
    });
  });
});