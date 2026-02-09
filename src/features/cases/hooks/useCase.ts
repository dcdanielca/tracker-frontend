import { useQuery } from "@tanstack/react-query";
import { casesApi } from "../services/casesApi";

export function useCase(id: string) {
  return useQuery({
    queryKey: ["cases", id],
    queryFn: () => casesApi.getCase(id),
    enabled: !!id,
  });
}
