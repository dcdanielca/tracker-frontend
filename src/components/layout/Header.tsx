import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to={PATHS.home} className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              Case Tracker
            </h1>
          </Link>
          <nav className="flex gap-4">
            <Link
              to={PATHS.casesList}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600 flex items-center justify-center"
            >
              Casos
            </Link>
            <Link
              to={PATHS.createCase}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Nuevo Caso
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
