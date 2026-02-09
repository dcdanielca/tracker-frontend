import { z } from "zod";

export const querySchema = z.object({
  database_name: z
    .string()
    .min(1, "El nombre de la base de datos es requerido")
    .max(100, "El nombre de la base de datos no puede exceder 100 caracteres"),
  schema_name: z
    .string()
    .min(1, "El nombre del schema es requerido")
    .max(100, "El nombre del schema no puede exceder 100 caracteres"),
  query_text: z
    .string()
    .min(5, "La query debe tener al menos 5 caracteres")
    .max(5000, "La query no puede exceder 5000 caracteres"),
});

export const createCaseSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(2000, "La descripción no puede exceder 2000 caracteres"),
  case_type: z.enum(["support", "requirement", "investigation"], {
    errorMap: () => ({ message: "Selecciona un tipo de caso válido" }),
  }),
  priority: z.enum(["low", "medium", "high", "critical"], {
    errorMap: () => ({ message: "Selecciona una prioridad válida" }),
  }),
  created_by: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  queries: z
    .array(querySchema)
    .min(1, "Debe haber al menos una query")
    .max(10, "No puedes agregar más de 10 queries"),
});

export type CreateCaseFormData = z.infer<typeof createCaseSchema>;
