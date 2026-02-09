# Prompt para crear claude.md

Actúa como un Senior Frontend Engineer con amplia experiencia en React, TypeScript y arquitectura escalable.

Quiero que desarrolles un frontend profesional para consumir una API REST de un sistema de tracking de casos y construyas el archivo claude.md para construir bases del proyecto

## 🔧 Stack requerido
- React 18+
- TypeScript 5+
- Vite
- TailwindCSS
- React Router
- TanStack Query (React Query)
- Axios
- React Hook Form + Zod
- ESLint + Prettier
- Vitest + Testing Library

## 📡 Backend API (FastAPI)

Endpoints disponibles:

GET    /api/v1/cases/
POST   /api/v1/cases/
GET    /api/v1/cases/{case_id}

Soporta:
- Paginación
- Filtros
- Búsqueda
- Ordenamiento

Campos principales:
- id
- title
- description
- case_type
- priority
- status
- created_by
- created_at
- queries

## 🎯 Objetivo

Construir un sistema frontend completo que permita:

1. Crear casos
2. Listar casos con filtros
3. Ver detalle del caso
4. Paginación (10 por página)
5. Validaciones
6. Manejo de errores
7. UX profesional

## 📁 Arquitectura requerida

Usa arquitectura limpia, escalable y modular:

src/
 ├── api/
 ├── components/
 │    ├── ui/
 │    ├── forms/
 │    ├── layout/
 │    └── tables/
 ├── features/
 │    ├── cases/
 │         ├── components/
 │         ├── hooks/
 │         ├── services/
 │         └── pages/
 ├── hooks/
 ├── lib/
 ├── routes/
 ├── schemas/
 ├── types/
 ├── utils/
 └── main.tsx

Aplica separación de responsabilidades.

## 🧩 Vistas requeridas

### 1️⃣ Listado de Casos

Ruta: /

- Tabla con:
  - Título
  - Tipo
  - Prioridad
  - Estado
  - Creador
  - Fecha
  - Queries count
- Filtros:
  - status
  - priority
  - case_type
  - search
  - fechas
- Paginación
- Ordenamiento
- Click → detalle

### 2️⃣ Crear Caso

Ruta: /cases/new

- Formulario con:
  - title
  - description
  - case_type
  - priority
  - created_by
  - queries dinámicas
- Validación con Zod
- Mensajes de error
- Loading states
- Redirect al crear

### 3️⃣ Detalle de Caso

Ruta: /cases/:id

- Información completa
- Tabla de queries
- Metadata
- Diseño limpio

## 🎨 UI / UX

- Tailwind moderno
- Responsive
- Componentes reutilizables
- Estados:
  - loading
  - empty
  - error
  - success
- Skeleton loaders
- Toast notifications

## 🧠 Buenas prácticas obligatorias

- Tipado estricto
- Hooks personalizados
- Sin lógica en componentes UI
- DRY
- KISS
- SOLID
- No props drilling
- Manejo centralizado de errores
- Variables de entorno

## 🧪 Testing

Implementa:

- Unit tests
- Component tests
- API mocks
- Coverage básico

Usa:
- Vitest
- Testing Library
- MSW

## 📦 Entregables

Debes generar:

1. Proyecto completo
2. Estructura
3. Archivos base
4. Configuración
5. Componentes principales
6. Ejemplos de tests
7. README con:
   - Instalación
   - Scripts
   - Testing
   - Arquitectura

## ⚠️ Reglas

- No código monolítico
- No componentes gigantes
- No lógica en JSX
- No any
- No console.log en producción


Empieza generando el setup completo del proyecto con Vite + Tailwind + TS.


# Estructura

Implementa estructura inicial del proyecto con requerimientos necesarios a instalar

# Ajustes a formulario

Del formulario hay algunos campos que no van, ya que son opcionales (hipoteticamente luego alguien los llenaria). Dentro de cada query no va ejecutador por, tiempo de ejecucion y tampoco filas afectadas

# Implementacion para ejecucion con docker

Ahora quiero que el proyecto use Docker y Makefile con buenas prácticas, donde contenta build, up, down, logs, shell y test

# Generacion de tests

Quiero implementar el resto de tests que faltan para todos los componentes, formulario, hooks, llamadas a API, rutas, estados

# Actualizacion README

ACtualiza READM para instalacion y ejecucion del proyecto.
Asi mismo un contexto de como está construido (explicando componentes)