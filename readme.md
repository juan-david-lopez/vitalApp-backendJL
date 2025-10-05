Sistema backend completo para la gestión de servicios clínicos de Salud Vital, que permite gestionar pacientes, citas médicas, resultados de exámenes y alertas de salud personalizadas.

📋 Tabla de Contenidos

Características
Arquitectura
Requisitos
Instalación
Configuración
Ejecución
API Endpoints
Testing
CI/CD Pipeline
Docker
Estructura del Proyecto
Buenas Prácticas
Troubleshooting


✨ Características

✅ Gestión de Pacientes: CRUD completo para registro y administración
📅 Sistema de Citas: Agendamiento y seguimiento de citas médicas
🔬 Resultados Médicos: Consulta de exámenes y análisis clínicos
🔔 Alertas Personalizadas: Notificaciones de salud automatizadas
🔐 Seguridad: Headers HTTP seguros con Helmet
📊 Logging: Sistema de logs estructurados con Morgan
🧪 Testing: Suite completa de tests unitarios e integración
🚀 CI/CD: Pipeline automatizado con GitHub Actions
🐳 Docker: Containerización completa con Docker Compose
📈 Health Checks: Endpoints de monitoreo de salud


🏗 Arquitectura
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Cliente   │─────▶│    Nginx     │─────▶│  VitalApp   │
│  (Browser)  │      │ (Reverse     │      │   Backend   │
└─────────────┘      │   Proxy)     │      └──────┬──────┘
                     └──────────────┘             │
                                                  │
                     ┌──────────────┐             │
                     │  PostgreSQL  │◀────────────┤
                     │  (Database)  │             │
                     └──────────────┘             │
                                                  │
                     ┌──────────────┐             │
                     │    Redis     │◀────────────┘
                     │   (Cache)    │
                     └──────────────┘
Stack Tecnológico

Runtime: Node.js 18.
Framework: Express.js 4.
Base de Datos: PostgreSQL 15 (preparado)
Cache: Redis 7
Reverse Proxy: Nginx
Testing: Jest + Supertest
CI/CD: GitHub Actions
Containerización: Docker + Docker Compose


📦 Requisitos
Requisitos de Sistema

Node.js: >= 18.0.0
npm: >= 9.0.0
Docker: >= 20.10 (opcional)
Docker Compose: >= 2.0 (opcional)

Dependencias Principales
json{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "morgan": "^1.10.0",
  "dotenv": "^16.3.1"
}

🚀 Instalación
1. Clonar el Repositorio
bashgit clone https://github.com/tu-organizacion/vitalapp-backend.git
cd vitalapp-backend
2. Instalar Dependencias
bashnpm install
3. Configurar Variables de Ambiente
bashcp .env.example .env
Editar .env con tus configuraciones:
envNODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vitalapp
# ... más configuraciones

⚙️ Configuración
Variables de Ambiente Importantes
VariableDescripciónDefaultRequeridaNODE_ENVAmbiente de ejecucióndevelopmentNoPORTPuerto del servidor3000NoDB_HOSTHost de PostgreSQLlocalhostSíDB_PORTPuerto de PostgreSQL5432NoDB_NAMENombre de la BDvitalappSíDB_USERUsuario de la BD-SíDB_PASSWORDPassword de la BD-SíREDIS_HOSTHost de RedislocalhostNoJWT_SECRETSecret para JWT-SíCORS_ORIGINOrigen permitido CORS*No
Configuración de Seguridad
El servidor implementa las siguientes medidas de seguridad:

Helmet: Headers HTTP seguros
CORS: Control de acceso entre orígenes
Rate Limiting: Limitación de peticiones (via Nginx)
Input Validation: Validación de datos de entrada
Error Handling: Manejo centralizado de errores


🎯 Ejecución
Modo Desarrollo
bashnpm run dev
El servidor se iniciará en http://localhost:3000 con hot-reload activado.
Modo Producción
bashnpm start
Con Docker
bash# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener servicios
docker-compose down
Scripts Disponibles
bashnpm run dev          # Desarrollo con nodemon
npm start            # Producción
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run lint         # Análisis de código
npm run lint:fix     # Fix automático de linting

🔌 API Endpoints
Health Checks
GET /health
Verifica el estado de salud del servicio.
Response:
json{
  "status": "healthy",
  "timestamp": "2025-10-04T10:00:00.000Z",
  "version": "1.0.0"
}
GET /ready
Verifica que el servicio está listo para recibir tráfico.
Response:
json{
  "status": "ready",
  "database": "connected",
  "cache": "connected"
}

Pacientes
GET /api/patients
Obtiene la lista de todos los pacientes.
Response:
json{
  "success": true,
  "data": [
    {
      "id": "PAT1696425600000",
      "name": "Juan Pérez",
      "email": "juan.perez@example.com",
      "phone": "3001234567",
      "birthDate": "1990-05-15",
      "createdAt": "2025-10-04T10:00:00.000Z"
    }
  ]
}
GET /api/patients/:id
Obtiene un paciente específico por ID.
Response:
json{
  "success": true,
  "data": {
    "id": "PAT1696425600000",
    "name": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "3001234567",
    "birthDate": "1990-05-15",
    "createdAt": "2025-10-04T10:00:00.000Z"
  }
}
POST /api/patients
Crea un nuevo paciente.
Request Body:
json{
  "name": "María González",
  "email": "maria@example.com",
  "phone": "3009876543",
  "birthDate": "1985-08-20"
}
Response: 201 Created
json{
  "success": true,
  "data": {
    "id": "PAT1696425700000",
    "name": "María González",
    "email": "maria@example.com",
    "phone": "3009876543",
    "birthDate": "1985-08-20",
    "createdAt": "2025-10-04T10:05:00.000Z"
  }
}

Citas Médicas
GET /api/appointments
Obtiene todas las citas. Puede filtrar por paciente.
Query Parameters:

patientId (opcional): Filtrar por ID de paciente

Response:
json{
  "success": true,
  "data": [
    {
      "id": "APT1696425800000",
      "patientId": "PAT1696425600000",
      "doctorName": "Dr. Carlos Ruiz",
      "date": "2025-10-15",
      "time": "10:00",
      "reason": "Consulta general",
      "status": "scheduled",
      "createdAt": "2025-10-04T10:10:00.000Z"
    }
  ]
}
POST /api/appointments
Crea una nueva cita médica.
Request Body:
json{
  "patientId": "PAT1696425600000",
  "doctorName": "Dr. Carlos Ruiz",
  "date": "2025-10-15",
  "time": "10:00",
  "reason": "Consulta general"
}
Response: 201 Created
PATCH /api/appointments/:id
Actualiza una cita existente.
Request Body:
json{
  "status": "completed",
  "notes": "Paciente evaluado exitosamente"
}
DELETE /api/appointments/:id
Cancela una cita médica.
Response:
json{
  "success": true,
  "message": "Cita cancelada exitosamente"
}

Resultados Médicos
GET /api/results/:patientId
Obtiene todos los resultados médicos de un paciente.
Response:
json{
  "success": true,
  "data": [
    {
      "id": "RES1696425900000",
      "patientId": "PAT1696425600000",
      "testType": "Hemograma",
      "values": {
        "hemoglobina": 14.5,
        "leucocitos": 7000,
        "plaquetas": 250000
      },
      "interpretation": "Valores normales",
      "doctorNotes": "Paciente en buen estado de salud",
      "date": "2025-10-04T10:15:00.000Z"
    }
  ]
}
POST /api/results
Registra un nuevo resultado médico.
Request Body:
json{
  "patientId": "PAT1696425600000",
  "testType": "Hemograma",
  "values": {
    "hemoglobina": 14.5,
    "leucocitos": 7000,
    "plaquetas": 250000
  },
  "interpretation": "Valores normales",
  "doctorNotes": "Paciente en buen estado de salud"
}

Alertas de Salud
GET /api/alerts/:patientId
Obtiene todas las alertas de un paciente.
Response:
json{
  "success": true,
  "data": [
    {
      "id": "ALT1696426000000",
      "patientId": "PAT1696425600000",
      "type": "medication",
      "message": "Recordatorio: Tomar medicamento a las 8:00 AM",
      "priority": "high",
      "isRead": false,
      "createdAt": "2025-10-04T10:20:00.000Z"
    }
  ]
}
POST /api/alerts
Crea una nueva alerta.
Request Body:
json{
  "patientId": "PAT1696425600000",
  "type": "medication",
  "message": "Recordatorio: Tomar medicamento a las 8:00 AM",
  "priority": "high"
}
PATCH /api/alerts/:id/read
Marca una alerta como leída.
Response:
json{
  "success": true,
  "data": {
    "id": "ALT1696426000000",
    "isRead": true,
    "readAt": "2025-10-04T11:00:00.000Z"
  }
}

🧪 Testing
Ejecutar Tests
bash# Todos los tests
npm test

# Tests con coverage
npm test -- --coverage

# Tests en modo watch
npm run test:watch

# Tests de integración solamente
npm run test:integration
Cobertura de Código
El proyecto mantiene los siguientes umbrales de cobertura:

Branches: 70%
Functions: 75%
Lines: 75%
Statements: 75%

Estructura de Tests
tests/
├── api.test.js           # Tests de API endpoints
├── integration/          # Tests de integración
└── unit/                 # Tests unitarios
Ejemplo de Test
javascriptdescribe('Patients API', () => {
  test('GET /api/patients - debe retornar 200', async () => {
    const response = await request(app).get('/api/patients');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

🔄 CI/CD Pipeline
Arquitectura del Pipeline
El pipeline de CI/CD está implementado con GitHub Actions y consta de 6 etapas principales:
┌─────────────────┐
│  Code Quality   │  → ESLint, npm audit
└────────┬────────┘
         │
┌────────▼────────┐
│      Test       │  → Jest tests, coverage
└────────┬────────┘
         │
┌────────▼────────┐
│     Build       │  → npm build
└────────┬────────┘
         │
┌────────▼────────┐
│  Docker Build   │  → Build & Push image
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼───┐  ┌──▼──────┐
│Staging│  │Production│
└───────┘  └─────────┘
Flujo de Trabajo
1. Code Quality (Análisis de Código)

ESLint para calidad de código
npm audit para vulnerabilidades
Se ejecuta en cada push y pull request

2. Tests (Pruebas Automatizadas)

Tests unitarios con Jest
Tests de integración
Reporte de cobertura de código
Matrix testing en Node 18.x y 20.x

3. Build (Construcción)

Instalación de dependencias de producción
Ejecución de build script
Generación de artefactos

4. Docker (Containerización)

Build de imagen Docker
Push a GitHub Container Registry
Tagging automático con versionado semántico

5. Deploy Staging (Despliegue a Pruebas)

Se activa en branch develop
Deploy automático a ambiente de staging
Smoke tests post-deployment

6. Deploy Production (Despliegue a Producción)

Se activa en branch main
Requiere aprobación manual (environment protection)
Health checks post-deployment
Creación automática de release en GitHub

Configuración del Pipeline
El archivo .github/workflows/ci-cd.yml contiene toda la configuración. Puntos clave:
yamlon:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
Secrets Requeridos
Configura estos secrets en GitHub Settings → Secrets and variables → Actions:
SecretDescripciónRequeridoGITHUB_TOKENToken automático de GitHub✅ AutoDOCKER_USERNAMEUsuario de Docker Hub❌ OpcionalDOCKER_PASSWORDPassword de Docker Hub❌ Opcional
Ambientes de Deployment
Staging Environment

URL: https://staging.vitalapp.com
Branch: develop
Auto-deploy: Sí
Protection: No

Production Environment

URL: https://vitalapp.com
Branch: main
Auto-deploy: Con aprobación
Protection: Sí (required reviewers)

Monitoreo del Pipeline
Ver el estado del pipeline:
bash# En GitHub
Actions → CI/CD Pipeline → Ver detalles

# Badges en README
![CI/CD](https://github.com/tu-org/vitalapp/workflows/CI-CD/badge.svg)
Estrategia de Branching
main (producción)
  ↑
  └── develop (staging)
        ↑
        ├── feature/nueva-funcionalidad
        ├── bugfix/correccion-error
        └── hotfix/error-critico
Flujo recomendado:

Crear feature branch desde develop
Hacer commits y push
Crear Pull Request a develop
Pipeline ejecuta tests y quality checks
Merge a develop → Deploy automático a staging
Crear PR de develop a main
Aprobación y merge → Deploy a producción


🐳 Docker
Construcción de Imagen
bash# Build local
docker build -t vitalapp-backend:latest .

# Build multi-platform
docker buildx build --platform linux/amd64,linux/arm64 -t vitalapp-backend:latest .
Ejecución con Docker
bash# Ejecutar contenedor individual
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --name vitalapp \
  vitalapp-backend:latest

# Ver logs
docker logs -f vitalapp

# Detener contenedor
docker stop vitalapp
Docker Compose
bash# Levantar todos los servicios
docker-compose up -d

# Ver servicios corriendo
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app

# Reiniciar servicios
docker-compose restart

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir servicios
docker-compose up -d --build
Estructura de Servicios Docker
El docker-compose.yml incluye:

app: Aplicación Node.js (puerto 3000)
postgres: Base de datos PostgreSQL (puerto 5432)
redis: Cache Redis (puerto 6379)
nginx: Reverse proxy (puertos 80/443)

Health Checks
Todos los contenedores incluyen health checks:
bash# Verificar salud de contenedores
docker-compose ps

# Output ejemplo:
NAME                 STATUS
vitalapp-backend     Up 2 minutes (healthy)
vitalapp-postgres    Up 2 minutes (healthy)
vitalapp-redis       Up 2 minutes (healthy)
Persistencia de Datos
Los volúmenes Docker persisten datos importantes:

postgres-data: Datos de PostgreSQL
redis-data: Datos de Redis
./logs: Logs de aplicación

bash# Listar volúmenes
docker volume ls

# Backup de base de datos
docker-compose exec postgres pg_dump -U vitalapp_user vitalapp > backup.sql

# Restaurar base de datos
docker-compose exec -T postgres psql -U vitalapp_user vitalapp < backup.sql

📁 Estructura del Proyecto
vitalapp-backend/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Pipeline CI/CD
├── nginx/
│   └── nginx.conf             # Configuración Nginx
├── scripts/
│   ├── init-db.sql            # Script inicialización BD
│   └── migrate.js             # Scripts de migración
├── tests/
│   ├── api.test.js            # Tests de API
│   ├── integration/           # Tests de integración
│   └── unit/                  # Tests unitarios
├── .dockerignore              # Exclusiones Docker
├── .env.example               # Ejemplo variables ambiente
├── .eslintrc.json             # Configuración ESLint
├── .gitignore                 # Exclusiones Git
├── docker-compose.yml         # Orquestación contenedores
├── Dockerfile                 # Imagen Docker
├── jest.config.js             # Configuración Jest
├── package.json               # Dependencias y scripts
├── README.md                  # Esta documentación
└── server.js                  # Servidor principal
Convenciones de Código

Indentación: 2 espacios
Comillas: Simples (')
Punto y coma: Obligatorio
Naming: camelCase para variables, PascalCase para clases
Archivos: kebab-case


🎯 Buenas Prácticas
Desarrollo

Siempre trabajar en branches: No hacer commits directos a main
Commits descriptivos: Usar conventional commits

bash   feat: agregar endpoint de citas
   fix: corregir validación de email
   docs: actualizar README
   test: agregar tests para pacientes

Pull Requests: Incluir descripción detallada y screenshots si aplica
Code Review: Mínimo 1 aprobación antes de merge
Tests: Escribir tests para toda nueva funcionalidad

Seguridad

Nunca commitear: .env, secrets, credentials
Variables sensibles: Usar variables de ambiente
Dependencias: Mantener actualizadas (npm audit fix)
HTTPS: Usar siempre en producción
Headers seguros: Ya implementados con Helmet
Rate Limiting: Configurado en Nginx

Performance

Índices de BD: Crear índices para queries frecuentes
Caching: Usar Redis para datos frecuentes
Connection pooling: Configurado en PostgreSQL
Compresión: Habilitada en Nginx (gzip)
Logs: Nivel apropiado según ambiente

Monitoring

Health checks: Usar /health y /ready
Logs estructurados: Usar formato JSON en producción
Métricas: Considerar integrar Prometheus
APM: Considerar New Relic o Datadog
Alertas: Configurar alertas para errores críticos


🔧 Troubleshooting
Problemas Comunes
El servidor no inicia
bash# Verificar que el puerto no esté en uso
lsof -i :3000

# Verificar variables de ambiente
cat .env

# Verificar logs
npm run dev
Tests fallan
bash# Limpiar cache de Jest
npm test -- --clearCache

# Ejecutar tests en modo verbose
npm test -- --verbose

# Ejecutar tests específicos
npm test -- tests/api.test.js
Docker no levanta
bash# Ver logs detallados
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Verificar puertos
docker-compose ps
Base de datos no conecta
bash# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Conectar manualmente
docker-compose exec postgres psql -U vitalapp_user -d vitalapp

# Ver logs de PostgreSQL
docker-compose logs postgres
Pipeline CI/CD falla

Verificar que todos los tests pasen localmente
Revisar logs en GitHub Actions
Verificar secrets configurados
Confirmar permisos de workflows

Logs y Debugging
bash# Ver logs en tiempo real
npm run dev

# Logs de producción
pm2 logs

# Logs de Docker
docker-compose logs -f app

# Logs de Nginx
docker-compose exec nginx tail -f /var/log/nginx/access.log
docker-compose exec nginx tail -f /var/log/nginx/error.log
Comandos Útiles
bash# Verificar salud del servidor
curl http://localhost:3000/health

# Test de un endpoint
curl -X GET http://localhost:3000/api/patients

# Test de POST
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"3001234567"}'

# Verificar conectividad PostgreSQL
docker-compose exec postgres pg_isready

# Verificar Redis
docker-compose exec redis redis-cli ping

📚 Recursos Adicionales
Documentación

Express.js Documentation
Node.js Best Practices
Docker Documentation
GitHub Actions Documentation

Herramientas Recomendadas

Postman: Testing de APIs
TablePlus: Cliente de PostgreSQL
Redis Commander: Cliente de Redis
Docker Desktop: Gestión de contenedores
VS Code: Editor recomendado

Extensiones VS Code

ESLint
Prettier
Docker
GitLens
REST Client
Thunder Client


🤝 Contribución
Cómo Contribuir

Fork del repositorio
Crear branch de feature (git checkout -b feature/nueva-caracteristica)
Commit de cambios (git commit -am 'feat: agregar nueva característica')
Push al branch (git push origin feature/nueva-caracteristica)
Crear Pull Request

Guía de Contribución

Seguir las convenciones de código existentes
Agregar tests para nueva funcionalidad
Actualizar documentación si es necesario
Asegurar que todos los tests pasen
Mantener cobertura de código > 75%


📄 Licencia
Este proyecto está bajo la Licencia MIT. Ver archivo LICENSE para más detalles.

👥 Equipo
Salud Vital - Equipo de Desarrollo

Product Owner: [Nombre]
Tech Lead: [Nombre]
DevOps Engineer: [Nombre]
Developers: [Nombres]


📞 Soporte
Para soporte técnico o preguntas:

Email: dev@saludvital.com
Slack: #vitalapp-dev
Issues: GitHub Issues


🗺 Roadmap
v1.1.0 (Q1 2026)

 Autenticación JWT completa
 Integración con servicios de email
 Dashboard de métricas
 Notificaciones push

v1.2.0 (Q2 2026)

 API de telemedicina
 Integración con sistemas de pago
 Reportes avanzados
 Aplicación móvil

v2.0.0 (Q3 2026)

 Inteligencia Artificial para diagnósticos
 Blockchain para historias clínicas
 IoT integration para dispositivos médicos
 Multi-tenancy


📊 Métricas del Proyecto

Cobertura de Tests: > 75%
Tiempo de Build: ~3 minutos
Tiempo de Deploy: ~5 minutos
Uptime: 99.9%
Response Time: < 200ms (p95)


✅ Checklist de Deployment
Antes de deployar a producción:

 Tests pasando (100%)
 Coverage > 75%
 Lint sin errores
 Security audit clean
 Variables de ambiente configuradas
 Backup de base de datos
 Health checks funcionando
 Logs configurados
 Monitoring activo
 Rollback plan documentado
 Equipo notificado
 Documentación actualizada