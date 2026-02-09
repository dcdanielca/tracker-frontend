import { http, HttpResponse } from "msw";
import { Case } from "@/types/case";
import { PaginatedResponse } from "@/types/api";

const mockCases: Case[] = [
  {
    id: "1",
    title: "Caso de prueba 1",
    description: "Descripción del caso de prueba 1",
    case_type: "support",
    priority: "high",
    status: "open",
    created_by: "Usuario Test",
    created_at: "2024-01-01T10:00:00Z",
    queries_count: 1,
  },
  {
    id: "2",
    title: "Caso de prueba 2",
    description: "Descripción del caso de prueba 2",
    case_type: "requirement",
    priority: "medium",
    status: "in_progress",
    created_by: "Usuario Test 2",
    created_at: "2024-01-02T10:00:00Z",
    queries_count: 0,
  },
];

export const handlers = [
  http.get("/api/v1/cases/", () => {
    const response: PaginatedResponse<Case> = {
      items: mockCases,
      total: 2,
      page: 1,
      size: 10,
      pages: 1,
    };
    return HttpResponse.json(response);
  }),

  http.get("/api/v1/cases/:id", ({ params }) => {
    const { id } = params;
    const caseItem = mockCases.find((c) => c.id === id);

    if (!caseItem) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(caseItem);
  }),

  http.post("/api/v1/cases/", async ({ request }) => {
    const body = await request.json();
    const newCase: Case = {
      id: "new-case-id",
      ...(body as Omit<Case, "id" | "status" | "created_at">),
      status: "open",
      created_at: new Date().toISOString(),
    };

    return HttpResponse.json(newCase, { status: 201 });
  }),
];
