import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/tables/Pagination";
import { CaseFilters } from "../components/CaseFilters";
import { CaseTable } from "../components/CaseTable";
import { useCases } from "../hooks/useCases";
import { useCaseFilters } from "../hooks/useCaseFilters";
import { PATHS } from "@/routes/paths";

export function CasesListPage() {
  const { filters, updateFilters, resetFilters } = useCaseFilters();
  const { data, isLoading, isError } = useCases(filters);

  if (isError) {
    return (
      <Container>
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-900">
            Error al cargar los casos
          </h2>
          <p className="mt-2 text-sm text-red-700">
            Por favor, intenta de nuevo más tarde
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Casos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona y da seguimiento a todos los casos
            </p>
          </div>
          <Link to={PATHS.createCase}>
            <Button>Nuevo Caso</Button>
          </Link>
        </div>

        <CaseFilters
          filters={filters}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            <CaseTable cases={data?.items || []} />

            {data && data.pages > 1 && (
              <Pagination
                currentPage={data.page}
                totalPages={data.pages}
                onPageChange={(page) => updateFilters({ page })}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </div>
    </Container>
  );
}
