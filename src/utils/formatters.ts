import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Priority, Status, CaseType } from "@/types/case";

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "dd MMM yyyy", { locale: es });
  } catch {
    return dateString;
  }
}

export function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    open: "Abierto",
    in_progress: "En Progreso",
    resolved: "Resuelto",
    closed: "Cerrado",
  };
  return labels[status];
}

export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Crítica",
  };
  return labels[priority];
}

export function getCaseTypeLabel(caseType: CaseType): string {
  const labels: Record<CaseType, string> = {
    support: "Soporte",
    requirement: "Requerimiento",
    investigation: "Investigación",
  };
  return labels[caseType];
}

export function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    open: "bg-green-100 text-green-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-blue-100 text-blue-800",
    closed: "bg-gray-100 text-gray-800",
  };
  return colors[status];
}

export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-200 text-red-900",
  };
  return colors[priority];
}

export function formatExecutionTime(ms: number | null): string {
  if (ms === null) return "N/A";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatRowsAffected(rows: number | null): string {
  if (rows === null) return "N/A";
  return rows.toLocaleString();
}
