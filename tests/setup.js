// Mock de variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.PORT = 3000;
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = 5432;
process.env.DB_NAME = 'vitalapp_test';
process.env.DB_USER = 'vitalapp_user';
process.env.DB_PASSWORD = 'secure_password_here';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = 6379;

// Configuración global para todos los tests
beforeAll(async () => {
  // Aquí puedes inicializar conexiones de prueba
  console.log('Setting up test environment...');
});

afterAll(async () => {
  // Aquí puedes cerrar conexiones y limpiar recursos
  console.log('Cleaning up test environment...');
});

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});