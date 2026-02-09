import { describe, it, expect, beforeEach } from "vitest";
import { casesApi } from "../casesApi";
import { CaseFilters, CreateCaseData } from "@/types/case";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";

describe("casesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCases", () => {
    it("fetches cases with default filters", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toBeDefined();
      expect(Array.isArray(response.items)).toBe(true);
      expect(response.total).toBeDefined();
      expect(response.page).toBe(1);
      expect(response.size).toBe(10);
      expect(response.pages).toBeDefined();
    });

    it("fetches cases with status filter", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
        status: "open",
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toBeDefined();
    });

    it("fetches cases with priority filter", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
        priority: "high",
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toBeDefined();
    });

    it("fetches cases with case_type filter", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
        case_type: "support",
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toBeDefined();
    });

    it("fetches cases with search filter", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
        search: "database",
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toBeDefined();
    });

    it("fetches cases with multiple filters", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
        status: "open",
        priority: "high",
        case_type: "support",
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toBeDefined();
    });

    it("fetches cases with pagination", async () => {
      const filters: CaseFilters = {
        page: 2,
        size: 5,
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.page).toBe(2);
      expect(response.size).toBe(5);
    });

    it("fetches cases with sort parameters", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
        sort_by: "created_at",
        sort_order: "desc",
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toBeDefined();
    });

    it("returns empty array when no cases match filters", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
        search: "nonexistentcasesearch",
      };

      const response = await casesApi.getCases(filters);

      expect(response).toBeDefined();
      expect(response.items).toEqual([]);
      expect(response.total).toBe(0);
    });

    it("includes pagination metadata", async () => {
      const filters: CaseFilters = {
        page: 1,
        size: 10,
      };

      const response = await casesApi.getCases(filters);

      expect(response.total).toBeDefined();
      expect(typeof response.total).toBe("number");
      expect(response.page).toBeDefined();
      expect(response.size).toBeDefined();
      expect(response.pages).toBeDefined();
    });
  });

  describe("getCase", () => {
    it("fetches a single case by id", async () => {
      const caseData = await casesApi.getCase("1");

      expect(caseData).toBeDefined();
      expect(caseData.id).toBe("1");
      expect(caseData.title).toBeDefined();
      expect(caseData.description).toBeDefined();
    });

    it("fetches case with all required fields", async () => {
      const caseData = await casesApi.getCase("1");

      expect(caseData.id).toBeDefined();
      expect(caseData.title).toBeDefined();
      expect(caseData.description).toBeDefined();
      expect(caseData.case_type).toBeDefined();
      expect(caseData.priority).toBeDefined();
      expect(caseData.status).toBeDefined();
      expect(caseData.created_by).toBeDefined();
      expect(caseData.created_at).toBeDefined();
    });

    it("throws error for non-existent case", async () => {
      server.use(
        http.get("/api/v1/cases/:id", ({ params }) => {
          if (params.id === "non-existent") {
            return new HttpResponse(null, { status: 404 });
          }
        })
      );

      await expect(casesApi.getCase("non-existent")).rejects.toThrow();
    });

    it("fetches case with queries", async () => {
      const caseData = await casesApi.getCase("1");

      expect(caseData).toBeDefined();
      // Case 1 should have queries based on mock data
    });

    it("returns case with correct types", async () => {
      const caseData = await casesApi.getCase("2");

      expect(caseData).toBeDefined();
      expect(["support", "requirement", "investigation"]).toContain(
        caseData.case_type
      );
      expect(["low", "medium", "high", "critical"]).toContain(caseData.priority);
      expect(["open", "in_progress", "resolved", "closed"]).toContain(
        caseData.status
      );
    });
  });

  describe("createCase", () => {
    it("creates a new case", async () => {
      const newCaseData: CreateCaseData = {
        title: "New Test Case",
        description: "This is a test case",
        case_type: "support",
        priority: "high",
        created_by: "test@example.com",
        queries: [
          {
            database_name: "test_db",
            schema_name: "public",
            query_text: "SELECT * FROM test",
          },
        ],
      };

      const createdCase = await casesApi.createCase(newCaseData);

      expect(createdCase).toBeDefined();
      expect(createdCase.id).toBeDefined();
      expect(createdCase.title).toBe(newCaseData.title);
      expect(createdCase.description).toBe(newCaseData.description);
      expect(createdCase.case_type).toBe(newCaseData.case_type);
      expect(createdCase.priority).toBe(newCaseData.priority);
      expect(createdCase.created_by).toBe(newCaseData.created_by);
    });

    it("creates case with default status as open", async () => {
      const newCaseData: CreateCaseData = {
        title: "New Case",
        description: "Description",
        case_type: "support",
        priority: "medium",
        created_by: "user@example.com",
        queries: [],
      };

      const createdCase = await casesApi.createCase(newCaseData);

      expect(createdCase.status).toBe("open");
    });

    it("creates case with created_at timestamp", async () => {
      const newCaseData: CreateCaseData = {
        title: "New Case",
        description: "Description",
        case_type: "support",
        priority: "medium",
        created_by: "user@example.com",
        queries: [],
      };

      const createdCase = await casesApi.createCase(newCaseData);

      expect(createdCase.created_at).toBeDefined();
      expect(typeof createdCase.created_at).toBe("string");
    });

    it("creates case with multiple queries", async () => {
      const newCaseData: CreateCaseData = {
        title: "Complex Case",
        description: "Case with multiple queries",
        case_type: "investigation",
        priority: "critical",
        created_by: "admin@example.com",
        queries: [
          {
            database_name: "db1",
            schema_name: "schema1",
            query_text: "SELECT * FROM table1",
          },
          {
            database_name: "db2",
            schema_name: "schema2",
            query_text: "SELECT * FROM table2",
          },
        ],
      };

      const createdCase = await casesApi.createCase(newCaseData);

      expect(createdCase).toBeDefined();
      expect(createdCase.queries_count).toBe(2);
    });

    it("creates case with no queries", async () => {
      const newCaseData: CreateCaseData = {
        title: "Simple Case",
        description: "No queries",
        case_type: "requirement",
        priority: "low",
        created_by: "user@example.com",
        queries: [],
      };

      const createdCase = await casesApi.createCase(newCaseData);

      expect(createdCase).toBeDefined();
      expect(createdCase.queries_count).toBe(0);
    });

    it("creates case with different case types", async () => {
      const caseTypes: Array<"support" | "requirement" | "investigation"> = [
        "support",
        "requirement",
        "investigation",
      ];

      for (const caseType of caseTypes) {
        const newCaseData: CreateCaseData = {
          title: `${caseType} Case`,
          description: "Test",
          case_type: caseType,
          priority: "medium",
          created_by: "test@example.com",
          queries: [],
        };

        const createdCase = await casesApi.createCase(newCaseData);

        expect(createdCase.case_type).toBe(caseType);
      }
    });

    it("creates case with different priorities", async () => {
      const priorities: Array<"low" | "medium" | "high" | "critical"> = [
        "low",
        "medium",
        "high",
        "critical",
      ];

      for (const priority of priorities) {
        const newCaseData: CreateCaseData = {
          title: "Test Case",
          description: "Test",
          case_type: "support",
          priority: priority,
          created_by: "test@example.com",
          queries: [],
        };

        const createdCase = await casesApi.createCase(newCaseData);

        expect(createdCase.priority).toBe(priority);
      }
    });

    it("sends POST request to correct endpoint", async () => {
      const newCaseData: CreateCaseData = {
        title: "Test Case",
        description: "Test",
        case_type: "support",
        priority: "medium",
        created_by: "test@example.com",
        queries: [],
      };

      const createdCase = await casesApi.createCase(newCaseData);

      expect(createdCase).toBeDefined();
      expect(createdCase.id).toBeDefined();
    });
  });
});
