// tests/integration/alerts.test.js
const request = require('supertest');
const app = require('../../server');

describe('Alerts API Endpoints', () => {
  beforeEach(() => {
    app.clearDB();
  });

  describe('POST /api/alerts', () => {
    it('should create a new alert', async () => {
      // Create a patient first
      const patientRes = await request(app)
        .post('/api/patients')
        .send({
          name: 'Test Patient',
          email: 'test@example.com',
          phone: '1234567890'
        });

      const patientId = patientRes.body.data.id;

      const res = await request(app)
        .post('/api/alerts')
        .send({
          patientId,
          type: 'medication',
          message: 'Time to take your medication',
          priority: 'high'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.patientId).toBe(patientId);
      expect(res.body.data.isRead).toBe(false);
    });

    it('should set type to general if not provided', async () => {
      // Create a patient first
      const patientRes = await request(app)
        .post('/api/patients')
        .send({
          name: 'Test Patient',
          email: 'test@example.com',
          phone: '1234567890'
        });

      const patientId = patientRes.body.data.id;

      const res = await request(app)
        .post('/api/alerts')
        .send({
          patientId,
          message: 'Test alert',
          priority: 'low'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.type).toBe('general');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .send({
          type: 'medication',
          message: 'Test alert'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Datos incompletos de la alerta');
    });
  });

  describe('GET /api/alerts/:patientId', () => {
    it('should get all alerts for a patient', async () => {
      // Create a patient
      const patientRes = await request(app)
        .post('/api/patients')
        .send({
          name: 'Test Patient',
          email: 'test@example.com',
          phone: '1234567890'
        });

      const patientId = patientRes.body.data.id;

      // Create two alerts for the patient
      await request(app)
        .post('/api/alerts')
        .send({
          patientId,
          message: 'Test alert 1',
          priority: 'high'
        });

      await request(app)
        .post('/api/alerts')
        .send({
          patientId,
          message: 'Test alert 2',
          priority: 'low'
        });

      const res = await request(app)
        .get(`/api/alerts/${patientId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].patientId).toBe(patientId);
      expect(res.body.data[1].patientId).toBe(patientId);
    });

    it('should return empty array if patient has no alerts', async () => {
      const patientId = 'NON_EXISTENT_ID';
      const res = await request(app)
        .get(`/api/alerts/${patientId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('PATCH /api/alerts/:id/read', () => {
    it('should mark an alert as read', async () => {
      // Create a patient
      const patientRes = await request(app)
        .post('/api/patients')
        .send({
          name: 'Test Patient',
          email: 'test@example.com',
          phone: '1234567890'
        });

      // Create an alert
      const alertRes = await request(app)
        .post('/api/alerts')
        .send({
          patientId: patientRes.body.data.id,
          message: 'Test alert',
          priority: 'high'
        });

      const alertId = alertRes.body.data.id;

      const res = await request(app)
        .patch(`/api/alerts/${alertId}/read`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isRead).toBe(true);
      expect(res.body.data).toHaveProperty('readAt');
    });

    it('should return 404 if alert does not exist', async () => {
      const res = await request(app)
        .patch('/api/alerts/NON_EXISTENT_ID/read');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Alerta no encontrada');
    });
  });
});