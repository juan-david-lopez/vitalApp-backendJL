module.exports = {
  // El ambiente de pruebas que usaremos (node para backend)
  testEnvironment: 'node',
  
  // Umbral de cobertura de código
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  
  // Archivos a incluir en la cobertura
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!jest.config.js'
  ],
  
  // Patrón para encontrar los archivos de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Configuración de reportes
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Tiempo máximo de ejecución por test
  testTimeout: 10000
};