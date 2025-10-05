const request = require('supertest');
const app = require('../../server');

describe('Appointment API Endpoints', () => {
  let patientId;

  beforeAll(async () => {
    const newPatient = {
      name: 'Test Patient',
      email: 'test@example.com',
      phone: '3001234567'
    };

    const res = await request(app)
      .post('/api/patients')
      .send(newPatient);

    patientId = res.body.data.id;
  });

  describe('GET /api/appointments', () => {
    it('should return empty list initially', async () => {
      const res = await request(app)
        .get('/api/appointments')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it('should filter appointments by patientId', async () => {
      const res = await request(app)
        .get(`/api/appointments?patientId=${patientId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/appointments', () => {
    it('should create a new appointment', async () => {
      const newAppointment = {
        patientId,
        doctorName: 'Dr. Smith',
        date: '2025-12-01',
        time: '10:00',
        reason: 'Check up'
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(newAppointment)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.patientId).toBe(patientId);
      expect(res.body.data.doctorName).toBe(newAppointment.doctorName);
      expect(res.body.data.id).toMatch(/^APT/);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidAppointment = {
        patientId
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(invalidAppointment)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Datos incompletos para la cita');
    });
  });

  describe('PATCH /api/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      const newAppointment = {
        patientId,
        doctorName: 'Dr. Smith',
        date: '2025-12-01',
        time: '10:00'
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(newAppointment);

      appointmentId = res.body.data.id;
    });

    it('should update appointment status', async () => {
      const res = await request(app)
        .patch(`/api/appointments/${appointmentId}`)
        .send({ status: 'completed' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('completed');
    });

    it('should return 404 for non-existent appointment', async () => {
      const res = await request(app)
        .patch('/api/appointments/APT999999999')
        .send({ status: 'completed' })
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Cita no encontrada');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      const newAppointment = {
        patientId,
        doctorName: 'Dr. Smith',
        date: '2025-12-01',
        time: '10:00'
      };

      const res = await request(app)
        .post('/api/appointments')
        .send(newAppointment);

      appointmentId = res.body.data.id;
    });

    it('should delete an appointment', async () => {
      const res = await request(app)
        .delete(`/api/appointments/${appointmentId}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Cita cancelada exitosamente');
    });

    it('should return 404 for non-existent appointment', async () => {
      const res = await request(app)
        .delete('/api/appointments/APT999999999')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Cita no encontrada');
    });
  });
});