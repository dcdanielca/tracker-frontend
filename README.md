# Case Tracker Frontend

Sistema frontend profesional para gestión de casos de soporte con queries SQL asociadas.

## 🚀 Características

- ✅ Listado de casos con filtros avanzados
- ✅ Creación de casos con queries dinámicas
- ✅ Vista detallada de casos
- ✅ Paginación (10 casos por página)
- ✅ Validación de formularios con Zod
- ✅ Manejo de errores con notificaciones
- ✅ Estados de loading con skeletons
- ✅ Testing con Vitest + Testing Library + MSW
- ✅ TypeScript strict mode
- ✅ Responsive design

## 🛠️ Stack Tecnológico

### Core
- **React 18.3+** - Librería UI
- **TypeScript 5.4+** - Tipado estático
- **Vite 5+** - Build tool

### Routing & State
- **React Router 6** - Routing
- **TanStack Query 5** - Server state management

### Forms & Validation
- **React Hook Form 7** - Gestión de formularios
- **Zod 3** - Schema validation

### Styling
- **TailwindCSS 3.4+** - Utility-first CSS
- **clsx + tailwind-merge** - Manejo de clases

### HTTP & Utilities
- **Axios 1.6+** - Cliente HTTP
- **date-fns 3** - Formateo de fechas
- **react-hot-toast 2** - Notificaciones

### Testing
- **Vitest** - Test runner
- **Testing Library** - Testing de componentes
- **MSW 2** - API mocking

## 📋 Pre-requisitos

### Opción 1: Con Docker (Recomendado)
- Docker 20+
- Docker Compose 2+
- Make

### Opción 2: Sin Docker
- Node.js 18+ o 20+
- npm 9+
- Backend API corriendo en `http://localhost:8000`

## 🔧 Instalación

### Con Docker (Recomendado) 🐳

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Construir las imágenes
make build

# 3. Iniciar
make up

# La aplicación estará disponible en http://localhost:5173
```

Ver [DOCKER.md](./DOCKER.md) para documentación completa de Docker y Makefile.

### Sin Docker

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Iniciar desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

## 📁 Estructura del Proyecto

```
src/
├── api/                      # Configuración de API
│   ├── client.ts            # Axios instance
│   └── types.ts             # Tipos de API
│
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes UI básicos
│   ├── forms/               # Componentes de formularios
│   ├── layout/              # Layout (Header, Container)
│   └── tables/              # Tablas y paginación
│
├── features/                # Features por dominio
│   └── cases/               # Feature de casos
│       ├── components/      # Componentes específicos
│       ├── hooks/           # Hooks personalizados
│       ├── services/        # Servicios de API
│       └── pages/           # Páginas
│
├── hooks/                   # Hooks globales
├── lib/                     # Configuración de librerías
├── routes/                  # Configuración de rutas
├── schemas/                 # Schemas de validación Zod
├── types/                   # Tipos TypeScript
├── utils/                   # Utilidades
├── test/                    # Testing setup y mocks
│
├── App.tsx                  # Componente principal
├── main.tsx                 # Entry point
└── index.css                # Estilos globales
```


## 🌍 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Nota:** Las variables deben empezar con `VITE_` para estar disponibles en el código.

---

**Desarrollado con ❤️ usando React + TypeScript + Vite**
