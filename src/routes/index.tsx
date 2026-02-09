import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CasesListPage } from "@/features/cases/pages/CasesListPage";
import { CreateCasePage } from "@/features/cases/pages/CreateCasePage";
import { CaseDetailPage } from "@/features/cases/pages/CaseDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CasesListPage />,
      },
      {
        path: "cases/new",
        element: <CreateCasePage />,
      },
      {
        path: "cases/:id",
        element: <CaseDetailPage />,
      },
    ],
  },
]);
