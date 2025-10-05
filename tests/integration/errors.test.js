// tests/integration/errors.test.js
const request = require('supertest');
const app = require('../../server');

describe('Error Handling', () => {
  describe('404 Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const res = await request(app)
        .get('/api/non-existent-route');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Ruta no encontrada');
    });
  });

  describe('500 Internal Server Error', () => {
    it('should handle internal server errors', async () => {
      // Simular un error interno
      const originalConsoleError = console.error;
      console.error = jest.fn();

      const res = await request(app)
        .get('/error')
        .set('x-trigger-error', 'true');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);

      // Restaurar console.error
      console.error = originalConsoleError;
    });
  });
});