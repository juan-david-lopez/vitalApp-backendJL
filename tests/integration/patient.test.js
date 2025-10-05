const request = require('supertest');
const app = require('../../server');

describe('Patient API Endpoints', () => {
  describe('GET /api/patients', () => {
    it('should return empty list initially', async () => {
      const res = await request(app)
        .get('/api/patients')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const newPatient = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '3001234567',
        birthDate: '1990-01-01'
      };

      const res = await request(app)
        .post('/api/patients')
        .send(newPatient)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(newPatient.name);
      expect(res.body.data.email).toBe(newPatient.email);
      expect(res.body.data.id).toMatch(/^PAT/);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidPatient = {
        name: 'John Doe'
      };

      const res = await request(app)
        .post('/api/patients')
        .send(invalidPatient)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Datos incompletos');
    });
  });

  describe('GET /api/patients/:id', () => {
    let patientId;

    beforeEach(async () => {
      const newPatient = {
        name: 'Test Patient',
        email: 'test@example.com',
        phone: '3009876543'
      };

      const res = await request(app)
        .post('/api/patients')
        .send(newPatient);

      patientId = res.body.data.id;
    });

    it('should return patient by ID', async () => {
      const res = await request(app)
        .get(`/api/patients/${patientId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(patientId);
    });

    it('should return 404 for non-existent patient', async () => {
      const res = await request(app)
        .get('/api/patients/PAT999999999')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Paciente no encontrado');
    });
  });
});