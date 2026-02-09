import { useNavigate } from "react-router-dom";
import { Case } from "@/types/case";
import { Badge } from "@/components/ui/Badge";
import { PATHS } from "@/routes/paths";
import {
  formatRelativeDate,
  getStatusLabel,
  getPriorityLabel,
  getCaseTypeLabel,
  getStatusColor,
  getPriorityColor,
} from "@/utils/formatters";

interface CaseTableProps {
  cases: Case[];
}

export function CaseTable({ cases }: CaseTableProps) {
  const navigate = useNavigate();

  if (cases.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">No se encontraron casos</p>
        <p className="mt-2 text-sm text-gray-400">
          Intenta ajustar los filtros o crea un nuevo caso
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Creador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Queries
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {cases.map((caseItem) => (
              <tr
                key={caseItem.id}
                onClick={() => navigate(PATHS.caseDetail(caseItem.id))}
                className="cursor-pointer transition-colors hover:bg-gray-50"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {caseItem.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {caseItem.description.substring(0, 50)}...
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-gray-900">
                    {getCaseTypeLabel(caseItem.case_type)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge className={getPriorityColor(caseItem.priority)}>
                    {getPriorityLabel(caseItem.priority)}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge className={getStatusColor(caseItem.status)}>
                    {getStatusLabel(caseItem.status)}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {caseItem.created_by}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {formatRelativeDate(caseItem.created_at)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                  {caseItem.queries_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
