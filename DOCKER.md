# Docker & Makefile Guide

## 📦 Resumen

Este proyecto incluye configuración completa de Docker con multi-stage builds y un Makefile con comandos útiles para desarrollo y producción.

## 🚀 Quick Start

### Desarrollo
```bash
# Construir las imágenes
make build

# Iniciar el entorno de desarrollo
make dev

# Ver logs en tiempo real
make logs

# Acceder al shell del contenedor
make shell
```

La aplicación estará disponible en: http://localhost:5173

### Producción
```bash
# Construir imagen de producción
make prod-build

# Iniciar entorno de producción
make prod
```

La aplicación estará disponible en: http://localhost:3000

## 📋 Comandos del Makefile

### Información
```bash
make help              # Muestra todos los comandos disponibles
make status            # Muestra el estado de los contenedores
```

### Desarrollo
```bash
make dev               # Inicia el entorno de desarrollo
make install           # Instala dependencias dentro del contenedor
```

### Operaciones Docker
```bash
make build             # Construye las imágenes Docker
make up                # Inicia los servicios
make down              # Detiene y remueve los contenedores
make restart           # Reinicia los servicios (down + up)
make logs              # Muestra logs de todos los servicios
make logs LOG_SERVICE=frontend-dev  # Logs de un servicio específico
make shell             # Accede al shell del contenedor
```

### Producción
```bash
make prod              # Inicia el entorno de producción
make prod-build        # Construye la imagen de producción
```

### Testing & Calidad
```bash
make test              # Ejecuta los tests
make test-coverage     # Ejecuta tests con reporte de cobertura
make test-ui           # Abre la UI de Vitest
make lint              # Ejecuta ESLint
make lint-fix          # Corrige problemas de linting
make format            # Formatea el código con Prettier
make type-check        # Verifica los tipos TypeScript
```

### Mantenimiento
```bash
make clean             # Remueve contenedores, volúmenes e imágenes
make clean-modules     # Remueve el volumen de node_modules
make prune             # Limpia todo el sistema Docker
```

### Utilidades
```bash
# Ejecutar comando en contenedor en ejecución
make exec CMD="npm install axios"

# Ejecutar comando one-off
make run CMD="npm run build"
```

## 🏗️ Arquitectura Docker

### Multi-Stage Build

El `Dockerfile` utiliza un build multi-stage con 3 etapas:

1. **Development**: Entorno de desarrollo con hot reload
   - Node.js 20 Alpine
   - Vite dev server
   - Volúmenes montados para hot reload

2. **Build**: Construcción de la aplicación
   - Instala dependencias
   - Ejecuta `npm run build`
   - Genera archivos optimizados

3. **Production**: Servidor de producción
   - Nginx Alpine
   - Archivos estáticos optimizados
   - Configuración de cache y compresión
   - Healthcheck incluido

### Docker Compose Profiles

El proyecto usa profiles de Docker Compose para diferentes entornos:

- **dev**: Entorno de desarrollo
- **prod**: Entorno de producción
- **test**: Ejecución de tests

### Volúmenes

- `node_modules`: Volumen nombrado para evitar conflictos entre host y contenedor
- Source code: Montado para hot reload en desarrollo

### Network

- `tracker-network`: Red bridge para comunicación entre contenedores

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# API Backend URL
VITE_API_BASE_URL=http://localhost:8000
```

### Nginx (Producción)

El archivo `nginx.conf` incluye:
- Compresión Gzip
- Headers de seguridad
- Cache de assets estáticos
- SPA routing (redirect a index.html)
- Proxy para API (configurable)

### Vite (Desarrollo)

Configuración adicional en `vite.config.ts`:
- `host: true`: Permite acceso desde fuera del contenedor
- `usePolling: true`: Hot reload en Docker
- Proxy a la API backend

## 🐳 Dockerfile Features

### Development Stage
```dockerfile
FROM node:20-alpine AS development
# - Hot reload habilitado
# - Port 5173 expuesto
# - Vite dev server
```

### Production Stage
```dockerfile
FROM nginx:alpine AS production
# - Nginx optimizado
# - Assets estáticos
# - Healthcheck
# - Port 80 expuesto
```

## 📝 Buenas Prácticas Implementadas

### Dockerfile
- ✅ Multi-stage build para optimización
- ✅ .dockerignore para reducir contexto de build
- ✅ Alpine images para menor tamaño
- ✅ Layer caching optimizado (package.json primero)
- ✅ Healthcheck en producción
- ✅ Non-root user (Nginx)

### Docker Compose
- ✅ Profiles para diferentes entornos
- ✅ Named volumes para persistencia
- ✅ Networks para aislamiento
- ✅ Environment variables
- ✅ Restart policies

### Makefile
- ✅ Help documentation
- ✅ Colors para mejor UX
- ✅ Comandos semánticos
- ✅ Error handling
- ✅ Organizados por categorías

## 🔍 Troubleshooting

### Hot Reload no funciona en Docker

**Solución**: El `vite.config.ts` ya incluye `usePolling: true` que soluciona este problema.

### Permisos en node_modules

**Solución**: Se usa un volumen nombrado para `node_modules` que evita conflictos de permisos.

### Puerto ya en uso

```bash
# Verificar qué está usando el puerto
lsof -i :5173

# Cambiar el puerto en docker-compose.yml
ports:
  - "5174:5173"  # Mapear a otro puerto del host
```

### Logs no se muestran

```bash
# Ver logs de todos los servicios
make logs

# Ver logs de un servicio específico
make logs LOG_SERVICE=frontend-dev

# Seguir logs en tiempo real
docker-compose logs -f --tail=100
```

### Contenedor no inicia

```bash
# Ver estado
make status

# Ver logs de error
docker-compose logs frontend-dev

# Reconstruir imagen
make build
make dev
```

## 🚦 Workflows Comunes

### Primer Setup
```bash
# 1. Construir imágenes
make build

# 2. Instalar dependencias
make install

# 3. Iniciar desarrollo
make dev

# 4. Ver logs
make logs
```

### Desarrollo Diario
```bash
# Iniciar
make dev

# Ver logs
make logs

# Ejecutar tests
make test

# Formatear código
make format

# Detener
make down
```

### Deploy a Producción
```bash
# 1. Construir imagen de producción
make prod-build

# 2. Iniciar producción
make prod

# 3. Verificar healthcheck
docker ps  # Ver estado del contenedor

# 4. Ver logs
make logs LOG_SERVICE=frontend-prod
```

### Agregar Nueva Dependencia
```bash
# Opción 1: Desde el host
npm install <package>

# Opción 2: Dentro del contenedor
make exec CMD="npm install <package>"

# Opción 3: Con make run (si contenedor no está corriendo)
make run CMD="npm install <package>"
```

### Debugging
```bash
# Acceder al shell
make shell

# Dentro del contenedor puedes ejecutar:
npm run dev
npm test
npm run lint
# etc...
```

## 📊 Monitoreo

### Healthcheck

El contenedor de producción incluye healthcheck:
```bash
# Ver estado del healthcheck
docker inspect tracker-frontend-prod | grep -A 10 Health
```

### Recursos

```bash
# Ver uso de recursos
docker stats tracker-frontend-dev

# Ver tamaño de imágenes
docker images | grep tracker-frontend
```

## 🔐 Seguridad

### Nginx Headers

El `nginx.conf` incluye headers de seguridad:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

### No root user

Nginx corre como usuario no-root por defecto en la imagen oficial.

## 🎯 Próximos Pasos

Para mejorar aún más la configuración Docker:

1. **CI/CD**: Agregar workflows de GitHub Actions
2. **Monitoreo**: Integrar Prometheus/Grafana
3. **Secrets**: Usar Docker secrets para producción
4. **Registry**: Publicar imágenes en Docker Hub/GHCR
5. **Orchestration**: Configuración para Kubernetes/Docker Swarm

## 📚 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Make Documentation](https://www.gnu.org/software/make/manual/)
