import { Link, useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { CaseDetail } from "../components/CaseDetail";
import { useCase } from "../hooks/useCase";
import { PATHS } from "@/routes/paths";

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: caseData, isLoading, isError } = useCase(id!);

  if (isLoading) {
    return (
      <Container>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </Container>
    );
  }

  if (isError || !caseData) {
    return (
      <Container>
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-red-900">
            Caso no encontrado
          </h2>
          <p className="mt-2 text-sm text-red-700">
            El caso que buscas no existe o fue eliminado
          </p>
          <Link to={PATHS.casesList} className="mt-4 inline-block">
            <Button>Volver a casos</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <Link to={PATHS.casesList} className="hover:text-primary-600">
                Casos
              </Link>
              <span>/</span>
              <span>Detalle</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Detalle del Caso
            </h1>
          </div>
          <Link to={PATHS.casesList}>
            <Button variant="secondary">Volver a casos</Button>
          </Link>
        </div>

        <CaseDetail caseData={caseData} />
      </div>
    </Container>
  );
}
