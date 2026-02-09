export type CaseType = "support" | "requirement" | "investigation";
export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "open" | "in_progress" | "resolved" | "closed";

export interface Query {
  id: string;
  case_id: string;
  database_name: string;
  schema_name: string;
  query_text: string;
  execution_time_ms: number | null;
  rows_affected: number | null;
  executed_at: string;
  executed_by: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  case_type: CaseType;
  priority: Priority;
  status: Status;
  created_by: string;
  created_at: string;
  queries_count: number;
}

export interface CaseDetailQueries {
  id: string;
  title: string;
  description: string;
  case_type: CaseType;
  priority: Priority;
  status: Status;
  created_by: string;
  created_at: string;
  queries: Query[];
}

export interface CreateQueryData {
  database_name: string;
  schema_name: string;
  query_text: string;
}

export interface CreateCaseData {
  title: string;
  description: string;
  case_type: CaseType;
  priority: Priority;
  created_by: string;
  queries: CreateQueryData[];
}

export interface CaseFilters {
  page?: number;
  size?: number;
  status?: Status;
  priority?: Priority;
  case_type?: CaseType;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
