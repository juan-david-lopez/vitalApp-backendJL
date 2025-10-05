# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar desde la etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/scripts ./scripts

# Crear directorio para logs
RUN mkdir -p logs

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]