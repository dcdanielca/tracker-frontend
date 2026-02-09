import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { CaseForm } from "../components/CaseForm";
import { PATHS } from "@/routes/paths";

export function CreateCasePage() {
  return (
    <Container>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link to={PATHS.casesList} className="hover:text-primary-600">
              Casos
            </Link>
            <span>/</span>
            <span>Nuevo Caso</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Caso</h1>
          <p className="mt-1 text-sm text-gray-500">
            Completa la información del caso y sus queries asociadas
          </p>
        </div>

        <CaseForm />
      </div>
    </Container>
  );
}
