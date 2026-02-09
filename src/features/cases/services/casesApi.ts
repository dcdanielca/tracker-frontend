import { apiClient } from "@/api/client";
import { Case, CaseFilters, CreateCaseData } from "@/types/case";
import { PaginatedResponse } from "@/types/api";

export const casesApi = {
  getCases: async (filters: CaseFilters): Promise<PaginatedResponse<Case>> => {
    const response = await apiClient.get<PaginatedResponse<Case>>(
      "/api/v1/cases/",
      { params: filters }
    );
    return response.data;
  },

  getCase: async (id: string): Promise<Case> => {
    const response = await apiClient.get<Case>(`/api/v1/cases/${id}`);
    return response.data;
  },

  createCase: async (data: CreateCaseData): Promise<Case> => {
    const response = await apiClient.post<Case>("/api/v1/cases/", data);
    return response.data;
  },
};
