import { useQuery } from "@tanstack/react-query";
import { casesApi } from "../services/casesApi";
import { CaseFilters } from "@/types/case";

export function useCases(filters: CaseFilters) {
  return useQuery({
    queryKey: ["cases", filters],
    queryFn: () => casesApi.getCases(filters),
  });
}
