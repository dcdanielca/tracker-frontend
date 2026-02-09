import { useSearchParams } from "react-router-dom";
import { CaseFilters, CaseType, Priority, Status } from "@/types/case";
import { PAGE_SIZE } from "@/utils/constants";

export function useCaseFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: CaseFilters = {
    page: Number(searchParams.get("page")) || 1,
    size: PAGE_SIZE,
    status: (searchParams.get("status") as Status) || undefined,
    priority: (searchParams.get("priority") as Priority) || undefined,
    case_type: (searchParams.get("case_type") as CaseType) || undefined,
    search: searchParams.get("search") || undefined,
    sort_by: searchParams.get("sort_by") || undefined,
    sort_order: (searchParams.get("sort_order") as "asc" | "desc") || undefined,
  };

  const updateFilters = (newFilters: Partial<CaseFilters>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 when filters change (except when changing page itself)
    if (!("page" in newFilters)) {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return { filters, updateFilters, resetFilters };
}
