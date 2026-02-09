import { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/useDebounce";
import { CASE_TYPES, PRIORITIES, STATUSES } from "@/utils/constants";
import { CaseFilters as CaseFiltersType } from "@/types/case";

interface CaseFiltersProps {
  filters: CaseFiltersType;
  onFiltersChange: (filters: Partial<CaseFiltersType>) => void;
  onReset: () => void;
}

export function CaseFilters({
  filters,
  onFiltersChange,
  onReset,
}: CaseFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onFiltersChange({ search: debouncedSearch || undefined });
  }, [debouncedSearch]);

  const hasActiveFilters =
    filters.status || filters.priority || filters.case_type || filters.search;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Buscar casos..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <Select
          options={STATUSES}
          value={filters.status || ""}
          onChange={(e) =>
            onFiltersChange({
              status: e.target.value || undefined,
            })
          }
          placeholder="Filtrar por status"
        />

        <Select
          options={PRIORITIES}
          value={filters.priority || ""}
          onChange={(e) =>
            onFiltersChange({
              priority: e.target.value || undefined,
            })
          }
          placeholder="Filtrar por prioridad"
        />

        <Select
          options={CASE_TYPES}
          value={filters.case_type || ""}
          onChange={(e) =>
            onFiltersChange({
              case_type: e.target.value || undefined,
            })
          }
          placeholder="Filtrar por tipo"
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onReset}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
