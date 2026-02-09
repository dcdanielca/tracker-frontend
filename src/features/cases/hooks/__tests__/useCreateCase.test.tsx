import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { useCreateCase } from "../useCreateCase";
import { CreateCaseData } from "@/types/case";
import { ReactNode } from "react";
import toast from "react-hot-toast";


vi.mock("../services/casesApi", () => ({
  casesApi: {
    createCase: vi.fn(),
  },
}));

// Mock toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    );
  }
  return Wrapper;
};

describe("useCreateCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("creates a case successfully", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const newCase: CreateCaseData = {
      title: "Test Case",
      description: "This is a test case description",
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

    result.current.mutate(newCase);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.title).toBe("Test Case");
  });

  it("shows success toast on successful creation", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const newCase: CreateCaseData = {
      title: "Test Case",
      description: "This is a test case description",
      case_type: "support",
      priority: "high",
      created_by: "test@example.com",
      queries: [],
    };

    result.current.mutate(newCase);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(toast.success).toHaveBeenCalledWith("Caso creado exitosamente");
  });

  it("navigates to case detail page on success", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const newCase: CreateCaseData = {
      title: "Test Case",
      description: "This is a test case description",
      case_type: "support",
      priority: "high",
      created_by: "test@example.com",
      queries: [],
    };

    result.current.mutate(newCase);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockNavigate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining("/cases/"));
  });

  it("provides loading state during mutation", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);

    const newCase: CreateCaseData = {
      title: "Test Case",
      description: "This is a test case description",
      case_type: "support",
      priority: "high",
      created_by: "test@example.com",
      queries: [],
    };

    result.current.mutate(newCase);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // After completion, isPending should be false again
    expect(result.current.isPending).toBe(false);
  });

  it("handles case with multiple queries", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const newCase: CreateCaseData = {
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

    result.current.mutate(newCase);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it("handles different case types", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const caseTypes: Array<"support" | "requirement" | "investigation"> = [
      "support",
      "requirement",
      "investigation",
    ];

    for (const caseType of caseTypes) {
      const newCase: CreateCaseData = {
        title: `${caseType} Case`,
        description: `A ${caseType} case`,
        case_type: caseType,
        priority: "medium",
        created_by: "test@example.com",
        queries: [],
      };

      result.current.mutate(newCase);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.case_type).toBe(caseType);
      result.current.reset();
    }
  });

  it("handles different priorities", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const priorities: Array<"low" | "medium" | "high" | "critical"> = [
      "low",
      "medium",
      "high",
      "critical",
    ];

    for (const priority of priorities) {
      const newCase: CreateCaseData = {
        title: "Test Case",
        description: "Test description",
        case_type: "support",
        priority: priority,
        created_by: "test@example.com",
        queries: [],
      };

      result.current.mutate(newCase);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.priority).toBe(priority);
      result.current.reset();
    }
  });

  it("provides error state", () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBeNull();
  });

  it("can reset mutation state", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const newCase: CreateCaseData = {
      title: "Test Case",
      description: "Test description",
      case_type: "support",
      priority: "medium",
      created_by: "test@example.com",
      queries: [],
    };

    result.current.mutate(newCase);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.reset();

    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
      expect(result.current.isSuccess).toBe(false);
    });
  });

  it("returns created case data", async () => {
    const { result } = renderHook(() => useCreateCase(), {
      wrapper: createWrapper(),
    });

    const newCase: CreateCaseData = {
      title: "New Test Case",
      description: "Detailed description",
      case_type: "requirement",
      priority: "high",
      created_by: "user@example.com",
      queries: [],
    };

    result.current.mutate(newCase);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const createdCase = result.current.data;
    expect(createdCase).toBeDefined();
    expect(createdCase?.id).toBeDefined();
    expect(createdCase?.status).toBe("open");
    expect(createdCase?.created_at).toBeDefined();
  });
});
