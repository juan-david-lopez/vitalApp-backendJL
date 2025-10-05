const app = require('./server');
const PORT = process.env.PORT || 4000;

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