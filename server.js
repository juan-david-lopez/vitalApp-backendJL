// server.js - VitalApp Backend API
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares de seguridad y utilidad
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Base de datos simulada (en producción usar PostgreSQL/MongoDB)
const db = {
  patients: [],
  appointments: [],
  results: [],
  alerts: []
};

// ==================== RUTAS DE SALUD ====================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/ready', (req, res) => {
  // Verificar conexiones a base de datos, cache, etc.
  res.status(200).json({
    status: 'ready',
    database: 'connected',
    cache: 'connected'
  });
});

// ==================== PACIENTES ====================
app.get('/api/patients', (req, res) => {
  console.log('GET /api/patients - Solicitud recibida');
  console.log('Pacientes en DB:', db.patients);
  res.json({
    success: true,
    data: db.patients,
    message: 'Lista de pacientes recuperada exitosamente'
  });
});

app.get('/api/patients/:id', (req, res) => {
  const patient = db.patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({
      success: false,
      error: 'Paciente no encontrado'
    });
  }
  res.json({
    success: true,
    data: patient
  });
});

app.post('/api/patients', (req, res) => {
  const { name, email, phone, birthDate } = req.body;
  
  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos'
    });
  }

  const newPatient = {
    id: `PAT${Date.now()}`,
    name,
    email,
    phone,
    birthDate,
    createdAt: new Date().toISOString()
  };

  db.patients.push(newPatient);
  
  res.status(201).json({
    success: true,
    data: newPatient
  });
});

// ==================== CITAS ====================
app.get('/api/appointments', (req, res) => {
  const { patientId } = req.query;
  
  let appointments = db.appointments;
  if (patientId) {
    appointments = appointments.filter(a => a.patientId === patientId);
  }

  res.json({
    success: true,
    data: appointments
  });
});

app.post('/api/appointments', (req, res) => {
  const { patientId, doctorName, date, time, reason } = req.body;

  if (!patientId || !doctorName || !date || !time) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos para la cita'
    });
  }

  const newAppointment = {
    id: `APT${Date.now()}`,
    patientId,
    doctorName,
    date,
    time,
    reason,
    status: 'scheduled',
    createdAt: new Date().toISOString()
  };

  db.appointments.push(newAppointment);

  res.status(201).json({
    success: true,
    data: newAppointment
  });
});

app.patch('/api/appointments/:id', (req, res) => {
  const appointment = db.appointments.find(a => a.id === req.params.id);
  
  if (!appointment) {
    return res.status(404).json({
      success: false,
      error: 'Cita no encontrada'
    });
  }

  Object.assign(appointment, req.body);
  appointment.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: appointment
  });
});

app.delete('/api/appointments/:id', (req, res) => {
  const index = db.appointments.findIndex(a => a.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Cita no encontrada'
    });
  }

  db.appointments.splice(index, 1);

  res.json({
    success: true,
    message: 'Cita cancelada exitosamente'
  });
});

// ==================== RESULTADOS MÉDICOS ====================
app.get('/api/results/:patientId', (req, res) => {
  const results = db.results.filter(r => r.patientId === req.params.patientId);
  
  res.json({
    success: true,
    data: results
  });
});

app.post('/api/results', (req, res) => {
  const { patientId, testType, values, interpretation, doctorNotes } = req.body;

  if (!patientId || !testType || !values) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos del resultado'
    });
  }

  const newResult = {
    id: `RES${Date.now()}`,
    patientId,
    testType,
    values,
    interpretation,
    doctorNotes,
    date: new Date().toISOString()
  };

  db.results.push(newResult);

  res.status(201).json({
    success: true,
    data: newResult
  });
});

// ==================== ALERTAS DE SALUD ====================
app.get('/api/alerts/:patientId', (req, res) => {
  const alerts = db.alerts.filter(a => a.patientId === req.params.patientId);
  
  res.json({
    success: true,
    data: alerts
  });
});

app.post('/api/alerts', (req, res) => {
  const { patientId, type, message, priority } = req.body;

  if (!patientId || !message || !priority) {
    return res.status(400).json({
      success: false,
      error: 'Datos incompletos de la alerta'
    });
  }

  const newAlert = {
    id: `ALT${Date.now()}`,
    patientId,
    type: type || 'general',
    message,
    priority,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.alerts.push(newAlert);

  res.status(201).json({
    success: true,
    data: newAlert
  });
});

app.patch('/api/alerts/:id/read', (req, res) => {
  const alert = db.alerts.find(a => a.id === req.params.id);
  
  if (!alert) {
    return res.status(404).json({
      success: false,
      error: 'Alerta no encontrada'
    });
  }

  alert.isRead = true;
  alert.readAt = new Date().toISOString();

  res.json({
    success: true,
    data: alert
  });
});

// ==================== MANEJO DE ERRORES ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor'
  });
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🏥 VitalApp Backend corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('📝 Rutas disponibles:');
  console.log('  - GET /health         - Verificar estado del servidor');
  console.log('  - GET /ready         - Verificar disponibilidad del servidor');
  console.log('  - GET /api/patients  - Obtener lista de pacientes');
  console.log('  - POST /api/patients - Crear nuevo paciente');
  console.log('  - GET /appointments  - Obtener lista de citas');
  console.log('  - POST /appointments - Crear nueva cita');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = app;