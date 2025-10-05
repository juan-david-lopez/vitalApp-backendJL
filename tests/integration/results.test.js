// tests/integration/results.test.js
const request = require('supertest');
const app = require('../../server');

describe('Results API Endpoints', () => {
  beforeEach(() => {
    app.clearDB();
  });

  describe('POST /api/results', () => {
    it('should create a new result', async () => {
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
        .post('/api/results')
        .send({
          patientId,
          testType: 'blood_test',
          values: {
            hemoglobin: 14,
            glucose: 90
          },
          interpretation: 'Normal values',
          doctorNotes: 'Patient is healthy'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.patientId).toBe(patientId);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/results')
        .send({
          interpretation: 'Normal values'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Datos incompletos del resultado');
    });
  });

  describe('GET /api/results/:patientId', () => {
    it('should get all results for a patient', async () => {
      // Create a patient
      const patientRes = await request(app)
        .post('/api/patients')
        .send({
          name: 'Test Patient',
          email: 'test@example.com',
          phone: '1234567890'
        });

      const patientId = patientRes.body.data.id;

      // Create two results for the patient
      await request(app)
        .post('/api/results')
        .send({
          patientId,
          testType: 'blood_test',
          values: { hemoglobin: 14 },
          interpretation: 'Normal'
        });

      await request(app)
        .post('/api/results')
        .send({
          patientId,
          testType: 'urine_test',
          values: { protein: 'negative' },
          interpretation: 'Normal'
        });

      const res = await request(app)
        .get(`/api/results/${patientId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].patientId).toBe(patientId);
      expect(res.body.data[1].patientId).toBe(patientId);
    });

    it('should return empty array if patient has no results', async () => {
      const patientId = 'NON_EXISTENT_ID';
      const res = await request(app)
        .get(`/api/results/${patientId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });
  });
});