import { http, HttpResponse } from "msw";
import { Case } from "@/types/case";
import { PaginatedResponse } from "@/types/api";
import { mockCases, mockCaseWithQueries } from "./data";

const baseURL = "http://localhost:8000";

export const handlers = [
  // GET /api/v1/cases/ - List cases with filters and pagination
  http.get(`${baseURL}/api/v1/cases/`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const size = parseInt(url.searchParams.get("size") || "10");
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const case_type = url.searchParams.get("case_type");
    const search = url.searchParams.get("search");

    let filteredCases = [...mockCases];

    // Apply filters
    if (status) {
      filteredCases = filteredCases.filter((c) => c.status === status);
    }
    if (priority) {
      filteredCases = filteredCases.filter((c) => c.priority === priority);
    }
    if (case_type) {
      filteredCases = filteredCases.filter((c) => c.case_type === case_type);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCases = filteredCases.filter(
        (c) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedCases = filteredCases.slice(start, end);

    const response: PaginatedResponse<Case> = {
      items: paginatedCases,
      total: filteredCases.length,
      page,
      size,
      pages: Math.ceil(filteredCases.length / size),
    };

    return HttpResponse.json(response);
  }),

  // GET /api/v1/cases/:id - Get single case with queries
  http.get(`${baseURL}/api/v1/cases/:id`, ({ params }) => {
    const { id } = params;

    // Return case with queries for case 1
    if (id === "1") {
      return HttpResponse.json(mockCaseWithQueries);
    }

    const caseItem = mockCases.find((c) => c.id === id);

    if (!caseItem) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(caseItem);
  }),

  // POST /api/v1/cases/ - Create new case
  http.post(`${baseURL}/api/v1/cases/`, async ({ request }) => {
    const body = (await request.json()) as any;

    const newCase: Case = {
      id: "new-case-id",
      title: body.title,
      description: body.description,
      case_type: body.case_type,
      priority: body.priority,
      created_by: body.created_by,
      status: "open",
      created_at: new Date().toISOString(),
      queries_count: body.queries?.length || 0,
    };

    return HttpResponse.json(newCase, { status: 201 });
  }),
];
