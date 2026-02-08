# Case Tracker Frontend - Especificación del Proyecto

## 📋 Contexto del Proyecto

Este es un frontend profesional para un sistema de tracking de casos que consume una API REST de FastAPI. El sistema permite gestionar casos de soporte técnico, facturación y otros tipos, con capacidad de crear, listar, filtrar y visualizar casos con sus queries asociadas.

## 🎯 Objetivos Principales

1. **Gestión de Casos**: Crear, listar y visualizar casos
2. **Filtrado Avanzado**: Por status, prioridad, tipo, búsqueda y fechas
3. **Paginación**: 10 casos por página con navegación
4. **Validación Robusta**: Formularios con Zod y React Hook Form
5. **UX Profesional**: Estados de loading, error, empty states
6. **Testing**: Cobertura con Vitest + Testing Library + MSW

## 🏗️ Arquitectura

### Principios Arquitectónicos

- **Clean Architecture**: Separación clara de responsabilidades
- **Feature-Based Structure**: Organización por features, no por tipos de archivos
- **Separation of Concerns**: Lógica de negocio separada de UI
- **DRY (Don't Repeat Yourself)**: Componentes y hooks reutilizables
- **SOLID**: Principios aplicados en diseño de componentes

### Estructura de Carpetas

```
src/
├── api/                      # Configuración de API
│   ├── client.ts            # Axios instance con interceptores
│   └── types.ts             # Tipos de respuestas API
│
├── components/              # Componentes reutilizables
│   ├── ui/                  # Componentes UI básicos
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── Skeleton.tsx
│   ├── forms/               # Componentes de formularios
│   │   ├── FormField.tsx
│   │   └── FormError.tsx
│   ├── layout/              # Componentes de layout
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   └── Container.tsx
│   └── tables/              # Componentes de tablas
│       ├── Table.tsx
│       ├── Pagination.tsx
│       └── ...
│
├── features/                # Features del sistema
│   └── cases/               # Feature de casos
│       ├── components/      # Componentes específicos de casos
│       │   ├── CaseTable.tsx
│       │   ├── CaseFilters.tsx
│       │   ├── CaseForm.tsx
│       │   ├── QueryForm.tsx
│       │   └── CaseDetail.tsx
│       ├── hooks/           # Hooks personalizados
│       │   ├── useCases.ts
│       │   ├── useCase.ts
│       │   ├── useCreateCase.ts
│       │   └── useCaseFilters.ts
│       ├── services/        # Servicios de API
│       │   └── casesApi.ts
│       └── pages/           # Páginas
│           ├── CasesListPage.tsx
│           ├── CreateCasePage.tsx
│           └── CaseDetailPage.tsx
│
├── hooks/                   # Hooks globales
│   ├── useDebounce.ts
│   └── useToast.ts
│
├── lib/                     # Configuración de librerías
│   ├── queryClient.ts       # TanStack Query config
│   └── utils.ts             # Utilidades (cn helper)
│
├── routes/                  # Configuración de rutas
│   ├── index.tsx            # React Router config
│   └── paths.ts             # Constantes de rutas
│
├── schemas/                 # Schemas de validación
│   └── caseSchema.ts        # Zod schemas
│
├── types/                   # Tipos TypeScript
│   ├── case.ts              # Tipos de dominio
│   └── api.ts               # Tipos de API
│
├── utils/                   # Utilidades
│   ├── formatters.ts        # Formateo de fechas, status, etc.
│   └── constants.ts         # Constantes y enums
│
├── test/                    # Testing
│   ├── setup.ts             # Vitest setup
│   ├── mocks/
│   │   ├── handlers.ts      # MSW handlers
│   │   └── server.ts        # MSW server
│   └── utils.tsx            # Test utilities
│
├── App.tsx                  # Componente principal
├── main.tsx                 # Entry point
└── index.css                # Estilos globales
```

## 🔧 Stack Tecnológico

### Core
- **React 18.3+**: Librería UI
- **TypeScript 5.4+**: Tipado estático
- **Vite 5+**: Build tool y dev server

### Routing & State
- **React Router 6**: Routing
- **TanStack Query 5**: Server state management

### Forms & Validation
- **React Hook Form 7**: Gestión de formularios
- **Zod 3**: Schema validation

### HTTP Client
- **Axios 1.6+**: Cliente HTTP con interceptores

### Styling
- **TailwindCSS 3.4+**: Utility-first CSS
- **clsx + tailwind-merge**: Manejo de clases condicionales

### Utilities
- **date-fns 3**: Formateo de fechas
- **react-hot-toast 2**: Notificaciones

### Testing
- **Vitest 1.3+**: Test runner
- **Testing Library**: Testing de componentes
- **MSW 2**: API mocking
- **jsdom**: DOM para tests

### Development
- **ESLint**: Linting
- **Prettier**: Code formatting
- **TypeScript strict mode**: Tipado estricto

## 📡 Integración con Backend API

### Base URL
```
http://localhost:8000
```

### Endpoints Disponibles

#### 1. Listar Casos
```
GET /api/v1/cases/
```

**Query Params:**
- `page` (int): Número de página (default: 1)
- `size` (int): Items por página (default: 10)
- `status` (string): Filtro por status ("open", "in_progress","resolved", "closed")
- `priority` (string): Filtro por prioridad (low, medium, high, critical)
- `case_type` (string): Filtro por tipo (support, requirement, investigation)
- `search` (string): Búsqueda en título/descripción
- `sort_by` (string): Campo para ordenar
- `sort_order` (string): "asc" o "desc"

**Response:**
```typescript
{
  items: Case[],
  total: number,
  page: number,
  size: number,
  pages: number
}
```

#### 2. Crear Caso
```
POST /api/v1/cases/
```

**Body:**
```typescript
{
  title: string,
  description: string,
  case_type: "technical" | "billing" | "support",
  priority: "low" | "medium" | "high" | "critical",
  created_by: string,
  queries: Array<{
    id: UUID
    case_id: UUID
    database_name: string
    schema_name: string
    query_text: string
    execution_time_ms: integer | null
    rows_affected: integer | None
    executed_at: datetime
    executed_by: string
  }>
}
```

**Response:**
```typescript
Case
```

#### 3. Obtener Caso
```
GET /api/v1/cases/{case_id}
```

**Response:**
```typescript
Case
```

### Modelos de Datos

#### Case
```typescript
interface Case {
  id: string;
  title: string;
  description: string;
  case_type: "technical" | "billing" | "support";
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  created_by: string;
  created_at: string; // ISO 8601
  queries: Query[];
}
```

#### Query
```typescript
interface Query {
    id: UUID
    case_id: UUID
    database_name: string
    schema_name: string
    query_text: string
    execution_time_ms: integer | None
    rows_affected: integer | None
    executed_at: datetime
    executed_by: string
}
```

## 🎨 Decisiones de Diseño

### Gestión de Estado

**TanStack Query (React Query)** para server state:
- Cache automático de 5 minutos
- Refetch on window focus deshabilitado
- Retry: 1 intento
- Invalidación automática después de mutaciones

**useState + URL Params** para filtros:
- Los filtros se sincronizan con la URL
- Permite compartir links con filtros aplicados
- Mantiene el estado en navegación back/forward

### Validación de Formularios

**React Hook Form + Zod:**
- Validación en tiempo real después del primer submit
- Mensajes de error claros y específicos
- Validación tanto en cliente como en servidor

**Reglas de Validación:**
- `title`: 5-200 caracteres
- `description`: 10-2000 caracteres
- `created_by`: 3-100 caracteres
- `queries`: 1-10 preguntas, cada una con mínimo 5 caracteres

### Manejo de Errores

1. **Interceptores de Axios**: Capturan errores HTTP
2. **Toast Notifications**: Muestran errores al usuario
3. **Error Boundaries**: Capturan errores de React (futura mejora)
4. **Estados de Error**: Componentes muestran UI de error con retry

### UX/UI Patterns

**Loading States:**
- Skeleton loaders para listas y detalles
- Spinners en botones durante acciones
- Indicadores de progreso en tablas

**Empty States:**
- Mensajes claros cuando no hay datos
- Sugerencias de acción (crear primer caso, ajustar filtros)
- Iconos descriptivos

**Responsive Design:**
- Mobile-first approach
- Breakpoints de Tailwind (sm, md, lg, xl)
- Tablas con scroll horizontal en mobile
- Sidebar colapsable en mobile

### Colores y Theming

**Status Colors:**
- `open`: Verde (#10b981)
- `in_progress`: Amarillo (#f59e0b)
- `resolved`: Azul (#3b82f6)
- `closed`: Gris (#6b7280)

**Priority Colors:**
- `low`: Verde (#10b981)
- `medium`: Amarillo (#f59e0b)
- `high`: Rojo (#ef4444)
- `critical`: Rojo oscuro (#dc2626)

**Primary Color:**
- Blue-600 (#2563eb)

## 🧪 Testing Strategy

### Unit Tests
- Hooks personalizados
- Utilidades (formatters, helpers)
- Validación schemas

### Component Tests
- Componentes UI aislados
- Interacciones de usuario
- Estados condicionales (loading, error, empty)

### Integration Tests
- Flujos completos (crear caso, filtrar, navegar)
- Interacción entre componentes
- API mocking con MSW

### Coverage Goals
- Funciones críticas: 90%+
- Componentes UI: 70%+
- Overall: 80%+

## 📝 Convenciones de Código

### TypeScript

**Strict Mode:**
```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true
}
```

**Prohibido:**
- Uso de `any` (usar `unknown` si es necesario)
- Type assertions innecesarios
- `console.log` en producción

### Naming Conventions

**Archivos:**
- Componentes: `PascalCase.tsx` (ej: `CaseCard.tsx`)
- Hooks: `camelCase.ts` (ej: `useCases.ts`)
- Utilidades: `camelCase.ts` (ej: `formatters.ts`)
- Constantes: `camelCase.ts` (ej: `constants.ts`)

**Variables:**
- Componentes: `PascalCase`
- Funciones/hooks: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Interfaces/Types: `PascalCase`

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/Button";

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
}

// 3. Component
export function Component({ title }: ComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState();

  // 3.2 Handlers
  const handleClick = () => {};

  // 3.3 Render
  return <div>{title}</div>;
}
```

### Custom Hooks Structure

```typescript
// 1. Imports
import { useQuery } from "@tanstack/react-query";

// 2. Hook
export function useCustomHook(param: string) {
  // 2.1 Queries/Mutations
  const query = useQuery({...});

  // 2.2 Logic
  const processedData = query.data?.map(...);

  // 2.3 Return
  return {
    data: processedData,
    isLoading: query.isLoading,
    error: query.error,
  };
}
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia dev server en puerto 5173

# Build
npm run build           # Build de producción (tsc + vite build)
npm run preview         # Preview del build de producción

# Testing
npm test                # Ejecuta tests en watch mode
npm run test:ui         # Abre UI de Vitest
npm run test:coverage   # Genera reporte de coverage

# Linting & Formatting
npm run lint            # Ejecuta ESLint
npm run lint:fix        # Arregla problemas de ESLint
npm run format          # Formatea código con Prettier
npm run type-check      # Verifica TypeScript sin emitir
```

## 🔐 Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000
```

**Nota:** Las variables deben empezar con `VITE_` para ser accesibles en el código.

## 📦 Instalación

### Pre-requisitos
- Node.js 18+ o 20+
- npm 9+

### Setup

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar desarrollo
npm run dev
```

## 🎯 Guía para Nuevas Features

### Agregar una Nueva Feature

1. **Crear estructura de carpetas:**
```
src/features/nueva-feature/
├── components/
├── hooks/
├── services/
└── pages/
```

2. **Definir tipos:**
```typescript
// src/types/nueva-feature.ts
export interface NewType {
  // ...
}
```

3. **Crear servicio API:**
```typescript
// src/features/nueva-feature/services/api.ts
export const newFeatureApi = {
  getItems: () => apiClient.get('/api/items'),
};
```

4. **Crear hooks personalizados:**
```typescript
// src/features/nueva-feature/hooks/useItems.ts
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: newFeatureApi.getItems,
  });
}
```

5. **Crear componentes:**
```typescript
// src/features/nueva-feature/components/ItemCard.tsx
export function ItemCard({ item }: { item: Item }) {
  // ...
}
```

6. **Crear página:**
```typescript
// src/features/nueva-feature/pages/ItemsPage.tsx
export function ItemsPage() {
  const { data } = useItems();
  return <ItemCard item={data} />;
}
```

7. **Agregar ruta:**
```typescript
// src/routes/index.tsx
{
  path: '/items',
  element: <ItemsPage />,
}
```

### Agregar un Nuevo Componente UI

```typescript
// src/components/ui/NewComponent.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NewComponentProps {
  variant?: "default" | "alternative";
}

export const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  ({ variant = "default", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-styles", className)}
        {...props}
      />
    );
  }
);

NewComponent.displayName = "NewComponent";
```

## 🐛 Troubleshooting

### Errores Comunes

**Error: "Cannot find module '@/...'"**
- Verificar que `vite.config.ts` tenga configurado el alias
- Verificar que `tsconfig.app.json` tenga configurado el path

**Error: "Network Error" en llamadas API**
- Verificar que el backend esté corriendo
- Verificar la variable `VITE_API_BASE_URL`
- Verificar el proxy en `vite.config.ts`

**Tests fallan con "ReferenceError: window is not defined"**
- Verificar que `vitest.config.ts` tenga `environment: "jsdom"`
- Verificar que `src/test/setup.ts` esté configurado correctamente

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev)

## 🤝 Contribución

### Code Review Checklist

- [ ] TypeScript sin errores (`npm run type-check`)
- [ ] Linting sin errores (`npm run lint`)
- [ ] Tests pasan (`npm test`)
- [ ] Código formateado (`npm run format`)
- [ ] Sin `any` types
- [ ] Sin `console.log` innecesarios
- [ ] Componentes pequeños y enfocados
- [ ] Lógica de negocio en hooks
- [ ] Props bien tipados
- [ ] Manejo de errores implementado
- [ ] Loading states implementados
- [ ] Responsive design

