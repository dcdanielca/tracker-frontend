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

- Node.js 18+ o 20+
- npm 9+
- Backend API corriendo en `http://localhost:8000`

## 🔧 Instalación

```bash
# Clonar el repositorio (o navegar al directorio)
cd tracker-frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tu configuración
# VITE_API_BASE_URL=http://localhost:8000
```

## 🏃 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Build de Producción

```bash
# Compilar TypeScript y generar build
npm run build

# Preview del build
npm run preview
```

### Testing

```bash
# Ejecutar tests en watch mode
npm test

# Ejecutar tests con UI
npm run test:ui

# Generar reporte de coverage
npm run test:coverage
```

### Linting & Formatting

```bash
# Ejecutar ESLint
npm run lint

# Arreglar problemas de ESLint
npm run lint:fix

# Formatear código con Prettier
npm run format

# Verificar tipos de TypeScript
npm run type-check
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

## 🔗 API Endpoints

El frontend consume los siguientes endpoints del backend:

### Listar Casos
```
GET /api/v1/cases/
Query Params: page, size, status, priority, case_type, search
```

### Obtener Caso
```
GET /api/v1/cases/{case_id}
```

### Crear Caso
```
POST /api/v1/cases/
Body: { title, description, case_type, priority, created_by, queries }
```

## 🎨 Convenciones de Código

### TypeScript
- Strict mode habilitado
- No uso de `any`
- Props e interfaces bien tipadas

### Naming
- Componentes: `PascalCase.tsx`
- Hooks: `camelCase.ts` (prefijo `use`)
- Utilidades: `camelCase.ts`
- Constantes: `UPPER_SNAKE_CASE`

### Componentes
```typescript
// Estructura recomendada
import { useState } from "react";

interface ComponentProps {
  title: string;
}

export function Component({ title }: ComponentProps) {
  const [state, setState] = useState();

  const handleClick = () => {
    // handler logic
  };

  return <div>{title}</div>;
}
```

### Hooks Personalizados
```typescript
export function useCustomHook(param: string) {
  const query = useQuery({...});

  return {
    data: query.data,
    isLoading: query.isLoading,
  };
}
```

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test Button

# Con coverage
npm run test:coverage
```

### Escribir Tests

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

## 🌍 Variables de Entorno

Crear archivo `.env` en la raíz:

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Nota:** Las variables deben empezar con `VITE_` para estar disponibles en el código.

## 🚨 Troubleshooting

### Error: "Cannot find module '@/...'"
Verificar que `vite.config.ts` y `tsconfig.app.json` tengan configurados los aliases correctamente.

### Error: "Network Error"
- Verificar que el backend esté corriendo
- Verificar `VITE_API_BASE_URL` en `.env`
- Verificar el proxy en `vite.config.ts`

### Tests fallan
- Verificar que `vitest.config.ts` tenga `environment: "jsdom"`
- Verificar que `src/test/setup.ts` esté configurado

## 📚 Documentación Adicional

- [CLAUDE.md](./CLAUDE.md) - Especificación completa del proyecto
- [React Documentation](https://react.dev)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [TailwindCSS](https://tailwindcss.com)

## 🤝 Contribución

### Checklist antes de commit

- [ ] `npm run type-check` sin errores
- [ ] `npm run lint` sin errores
- [ ] `npm test` todos los tests pasan
- [ ] `npm run format` código formateado
- [ ] Sin `any` types
- [ ] Sin `console.log` innecesarios
- [ ] Componentes pequeños y enfocados
- [ ] Tests actualizados

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Desarrollado con ❤️ usando React + TypeScript + Vite**
