import { CaseType, Priority, Status } from "@/types/case";

export const CASE_TYPES: { value: CaseType; label: string }[] = [
  { value: "support", label: "Soporte" },
  { value: "requirement", label: "Requerimiento" },
  { value: "investigation", label: "Investigación" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
];

export const STATUSES: { value: Status; label: string }[] = [
  { value: "open", label: "Abierto" },
  { value: "in_progress", label: "En Progreso" },
  { value: "resolved", label: "Resuelto" },
  { value: "closed", label: "Cerrado" },
];

export const PAGE_SIZE = 10;
