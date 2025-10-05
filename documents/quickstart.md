# 🚀 Guía de Inicio Rápido - VitalApp Backend

Esta guía te ayudará a tener el backend de VitalApp funcionando en menos de 10 minutos.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) >= 18.0.0
- [npm](https://www.npmjs.com/) >= 9.0.0
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (opcional, pero recomendado)

Verificar instalación:

```bash
node --version  # v18.0.0 o superior
npm --version   # v9.0.0 o superior
git --version   # cualquier versión reciente
docker --version  # opcional
```

---

## ⚡ Inicio Rápido (5 minutos)

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-org/vitalapp-backend.git
cd vitalapp-backend

# 2. Levantar todos los servicios
docker-compose up -d

# 3. Verificar que funciona
curl http://localhost:3000/health

# ✅ ¡Listo! API corriendo en http://localhost:3000
```

### Opción 2: Sin Docker

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-org/vitalapp-backend.git
cd vitalapp-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de ambiente
cp .env.example .env

# 4. Iniciar servidor
npm run dev

# ✅ ¡Listo! API corriendo en http://localhost:3000
```

---

## 🧪 Verificar Instalación

### 1. Health Check

```bash
curl http://localhost:3000/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T10:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Listar Pacientes

```bash
curl http://localhost:3000/api/patients
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": []
}
```

### 3. Crear Paciente

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "3001234567",
    "birthDate": "1990-05-15"
  }'
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "PAT1696425600000",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "3001234567",
    "birthDate": "1990-05-15",
    "createdAt": "2025-10-04T10:00:00.000Z"
  }
}
```

✅ Si recibes estas respuestas, ¡todo está funcionando correctamente!

---

## 🔧 Comandos Esenciales

### Desarrollo

```bash
# Iniciar en modo desarrollo (con hot-reload)
npm run dev

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Verificar código (linting)
npm run lint

# Corregir problemas de linting automáticamente
npm run lint:fix
```

### Docker

```bash
# Levantar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Reconstruir imágenes
docker-compose up -d --build

# Ver estado de servicios
docker-compose ps
```

### Base de Datos

```bash
# Conectar a PostgreSQL
docker-compose exec postgres psql -U vitalapp_user -d vitalapp

# Ejecutar scripts SQL
docker-compose exec -T postgres psql -U vitalapp_user vitalapp < scripts/init-db.sql

# Backup de base de datos
docker-compose exec postgres pg_dump -U vitalapp_user vitalapp > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U vitalapp_user vitalapp < backup.sql
```

---

## 📝 Primeros Pasos

### 1. Explorar la API

Usa Postman o cualquier cliente HTTP:

1. Importa la colección: `VitalApp.postman_collection.json`
2. Configura la variable `base_url` = `http://localhost:3000`
3. Ejecuta las requests en orden

### 2. Revisar Documentación

```bash
# Ver README completo
cat README.md

# Ver documentación de CI/CD
cat docs/CICD.md

# Ver documentación de API
# Abrir en navegador: http://localhost:3000
```

### 3. Ejecutar Tests

```bash
# Tests completos
npm test

# Ver reporte de cobertura
npm test -- --coverage
open coverage/lcov-report/index.html
```

### 4. Modificar Código

```bash
# Abrir en VS Code
code .

# El archivo principal está en:
# server.js

# Los tests están en:
# tests/api.test.js
```

---

## 🎯 Casos de Uso Comunes

### Crear un Paciente y Agendar Cita

```bash
# 1. Crear paciente
PATIENT=$(curl -s -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María González",
    "email": "maria@example.com",
    "phone": "3009876543"
  }' | jq -r '.data.id')

echo "Paciente creado: $PATIENT"

# 2. Crear cita
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT\",
    \"doctorName\": \"Dr. Carlos Ruiz\",
    \"date\": \"2025-10-15\",
    \"time\": \"10:00\",
    \"reason\": \"Consulta general\"
  }"

# 3. Ver citas del paciente
curl "http://localhost:3000/api/appointments?patientId=$PATIENT"
```

### Registrar Resultado Médico

```bash
# 1. Obtener ID del paciente
PATIENT_ID="PAT1696425600000"

# 2. Crear resultado
curl -X POST http://localhost:3000/api/results \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"testType\": \"Hemograma\",
    \"values\": {
      \"hemoglobina\": 14.5,
      \"leucocitos\": 7000,
      \"plaquetas\": 250000
    },
    \"interpretation\": \"Valores normales\",
    \"doctorNotes\": \"Paciente en buen estado de salud\"
  }"

# 3. Ver resultados del paciente
curl "http://localhost:3000/api/results/$PATIENT_ID"
```

### Crear y Gestionar Alertas

```bash
# 1. Crear alerta
ALERT=$(curl -s -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"type\": \"medication\",
    \"message\": \"Recordatorio: Tomar medicamento a las 8:00 AM\",
    \"priority\": \"high\"
  }" | jq -r '.data.id')

echo "Alerta creada: $ALERT"

# 2. Ver alertas del paciente
curl "http://localhost:3000/api/alerts/$PATIENT_ID"

# 3. Marcar alerta como leída
curl -X PATCH "http://localhost:3000/api/alerts/$ALERT/read"
```

---

## 🛠 Configuración Avanzada

### Variables de Ambiente Importantes

Edita el archivo `.env`:

```env
# Puerto del servidor
PORT=3000

# Ambiente (development, staging, production)
NODE_ENV=development

# Base de datos (cuando uses PostgreSQL real)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vitalapp
DB_USER=vitalapp_user
DB_PASSWORD=tu_password_seguro

# Redis (para caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS (permite requests desde tu frontend)
CORS_ORIGIN=http://localhost:3001

# JWT (para autenticación futura)
JWT_SECRET=tu_secreto_muy_seguro_minimo_32_caracteres

# Logs
LOG_LEVEL=info
LOG_FILE=./logs/vitalapp.log
```

### Configurar Base de Datos PostgreSQL

Si quieres usar PostgreSQL real en lugar de la BD en memoria:

```bash
# 1. Asegúrate que PostgreSQL está corriendo
docker-compose up -d postgres

# 2. Ejecutar script de inicialización
docker-compose exec -T postgres psql -U vitalapp_user vitalapp < scripts/init-db.sql

# 3. Verificar tablas creadas
docker-compose exec postgres psql -U vitalapp_user vitalapp -c "\dt"

# 4. Actualizar server.js para usar PostgreSQL
# (Actualmente usa BD en memoria para simplicidad)
```

### Configurar Redis

```bash
# 1. Verificar que Redis está corriendo
docker-compose exec redis redis-cli ping
# Respuesta: PONG

# 2. Probar conexión
docker-compose exec redis redis-cli
> SET test "Hello Redis"
> GET test
> EXIT

# 3. Integrar en tu código (futuro)
# npm install redis
```

---

## 🔍 Debugging

### Ver Logs

```bash
# Logs de la aplicación
npm run dev
# Los logs aparecen en la consola

# Logs con Docker
docker-compose logs -f app

# Logs de PostgreSQL
docker-compose logs -f postgres

# Logs de Redis
docker-compose logs -f redis

# Logs de Nginx
docker-compose logs -f nginx
```

### Problemas Comunes

#### El servidor no inicia

```bash
# Verificar que el puerto 3000 no esté en uso
lsof -i :3000

# Si está en uso, matar el proceso
kill -9 <PID>

# O cambiar el puerto en .env
PORT=3001
```

#### Tests fallan

```bash
# Limpiar cache de Jest
npm test -- --clearCache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Ejecutar tests con más información
npm test -- --verbose
```

#### Docker no levanta

```bash
# Ver qué está fallando
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Verificar puertos disponibles
docker-compose ps
```

#### Cannot connect to database

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Reiniciar PostgreSQL
docker-compose restart postgres

# Verificar conexión manual
docker-compose exec postgres psql -U vitalapp_user -d vitalapp
```

---

## 🌐 Acceder desde Otro Dispositivo

### En la Red Local

```bash
# 1. Obtener tu IP local
# macOS/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows:
ipconfig

# Ejemplo: 192.168.1.100

# 2. Actualizar CORS_ORIGIN en .env
CORS_ORIGIN=*

# 3. Acceder desde otro dispositivo
# http://192.168.1.100:3000/health
```

### Exponer con ngrok

```bash
# 1. Instalar ngrok
# https://ngrok.com/download

# 2. Crear túnel
ngrok http 3000

# 3. Usar la URL pública generada
# https://abc123.ngrok.io
```

---

## 📚 Siguientes Pasos

Ahora que tienes VitalApp funcionando, puedes:

### 1. Explorar el Código

```bash
# Estructura del proyecto
tree -L 2

# Archivo principal
code server.js

# Tests
code tests/api.test.js

# Configuración
code package.json
```

### 2. Agregar Nueva Funcionalidad

```bash
# Crear nueva branch
git checkout -b feature/mi-nueva-funcionalidad

# Hacer cambios
code server.js

# Ejecutar tests
npm test

# Commit y push
git add .
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/mi-nueva-funcionalidad
```

### 3. Configurar CI/CD

```bash
# El pipeline ya está configurado en:
.github/workflows/ci-cd.yml

# Para activarlo:
# 1. Sube tu código a GitHub
# 2. El pipeline se ejecuta automáticamente
# 3. Revisa el progreso en Actions
```

### 4. Conectar con Frontend

```javascript
// Ejemplo de fetch desde frontend
const API_URL = 'http://localhost:3000';

// Obtener pacientes
async function getPatients() {
  const response = await fetch(`${API_URL}/api/patients`);
  const data = await response.json();
  return data.data;
}

// Crear paciente
async function createPatient(patientData) {
  const response = await fetch(`${API_URL}/api/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patientData),
  });
  const data = await response.json();
  return data.data;
}
```

### 5. Deploy a Producción

```bash
# Ver guía completa de deployment
cat docs/CICD.md

# Proceso básico:
# 1. Merge a develop → Deploy a staging
# 2. Probar en staging
# 3. Merge a main → Deploy a producción
```

---

## 🎓 Recursos de Aprendizaje

### Documentación del Proyecto

- **README.md**: Documentación completa
- **docs/CICD.md**: Guía de CI/CD
- **docs/QUICKSTART.md**: Esta guía
- **server.js**: Código fuente comentado

### Tutoriales Recomendados

- [Express.js Tutorial](https://expressjs.com/en/starter/hello-world.html)
- [REST API Design](https://restfulapi.net/)
- [Docker Tutorial](https://docker-curriculum.com/)
- [GitHub Actions](https://docs.github.com/en/actions/quickstart)

### Herramientas Útiles

- **Postman**: Testing de APIs
- **VS Code**: Editor de código
- **TablePlus**: Cliente de PostgreSQL
- **Docker Desktop**: Gestión de contenedores

---

## 🤝 Obtener Ayuda

### Documentación

```bash
# Ver README completo
cat README.md

# Ver endpoints disponibles
cat docs/API.md

# Ver guía de CI/CD
cat docs/CICD.md
```

### Soporte

- **Email**: dev@saludvital.com
- **Slack**: #vitalapp-dev
- **GitHub Issues**: [Abrir issue](https://github.com/tu-org/vitalapp/issues)

### Contribuir

```bash
# Ver guía de contribución
cat CONTRIBUTING.md

# Flujo básico:
# 1. Fork del repositorio
# 2. Crear branch de feature
# 3. Hacer cambios
# 4. Crear Pull Request
```

---

## ✅ Checklist de Verificación

Antes de empezar a desarrollar, verifica:

- [ ] Node.js >= 18.0.0 instalado
- [ ] npm >= 9.0.0 instalado
- [ ] Docker instalado (opcional)
- [ ] Git configurado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] `.env` configurado
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Health check respondiendo (`curl localhost:3000/health`)
- [ ] Tests pasando (`npm test`)
- [ ] Postman collection importada
- [ ] Editor de código configurado

---

## 🎉 ¡Listo para Desarrollar!

Ahora tienes todo lo necesario para comenzar a desarrollar con VitalApp. 

### Comandos de Referencia Rápida

```bash
# Desarrollo
npm run dev              # Iniciar servidor
npm test                 # Ejecutar tests
npm run lint             # Verificar código

# Docker
docker-compose up -d     # Levantar servicios
docker-compose logs -f   # Ver logs
docker-compose down      # Detener servicios

# Git
git checkout -b feature/nueva  # Nueva feature
git add .                      # Agregar cambios
git commit -m "feat: ..."      # Commit
git push origin feature/nueva  # Push

# Testing
curl localhost:3000/health           # Health check
curl localhost:3000/api/patients     # Listar pacientes
```
**Equipo de Desarrollo - Salud Vital**