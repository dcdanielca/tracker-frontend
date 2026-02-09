import { CaseDetailQueries } from "@/types/case";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  formatDate,
  getStatusLabel,
  getPriorityLabel,
  getCaseTypeLabel,
  getStatusColor,
  getPriorityColor,
  formatExecutionTime,
  formatRowsAffected,
} from "@/utils/formatters";

interface CaseDetailProps {
  caseData: CaseDetailQueries;
}

export function CaseDetail({ caseData }: CaseDetailProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{caseData.title}</CardTitle>
              <p className="mt-2 text-sm text-gray-500">Caso #{caseData.id}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(caseData.status)}>
                {getStatusLabel(caseData.status)}
              </Badge>
              <Badge className={getPriorityColor(caseData.priority)}>
                {getPriorityLabel(caseData.priority)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
            <p className="mt-1 text-sm text-gray-900">{caseData.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
              <p className="mt-1 text-sm text-gray-900">
                {getCaseTypeLabel(caseData.case_type)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Creado por</h3>
              <p className="mt-1 text-sm text-gray-900">
                {caseData.created_by}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(caseData.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Queries ({caseData.queries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {caseData.queries.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hay queries asociadas a este caso
            </p>
          ) : (
            <div className="space-y-4">
              {caseData.queries.map((query, index) => (
                <div
                  key={query.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">
                      Query {index + 1}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(query.executed_at)}
                    </span>
                  </div>

                  <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">
                        Base de Datos:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {query.database_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">
                        Schema:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {query.schema_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">
                        Ejecutado por:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {query.executed_by}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">
                        Tiempo:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {formatExecutionTime(query.execution_time_ms)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">
                        Filas afectadas:
                      </span>
                      <span className="ml-2 text-sm text-gray-900">
                        {formatRowsAffected(query.rows_affected)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500">
                      Query SQL:
                    </span>
                    <pre className="mt-2 overflow-x-auto rounded bg-gray-50 p-3 text-xs text-gray-900">
                      {query.query_text}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
