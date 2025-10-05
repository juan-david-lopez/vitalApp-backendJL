describe('Patient Validation', () => {
  test('should validate patient email format', () => {
    const validEmail = 'patient@example.com';
    const invalidEmail = 'invalid-email';

    expect(isValidEmail(validEmail)).toBe(true);
    expect(isValidEmail(invalidEmail)).toBe(false);
  });

  test('should validate patient phone format', () => {
    const validPhone = '3001234567';
    const invalidPhone = '123';

    expect(isValidPhone(validPhone)).toBe(true);
    expect(isValidPhone(invalidPhone)).toBe(false);
  });
});

// Funciones de validación de ejemplo
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}