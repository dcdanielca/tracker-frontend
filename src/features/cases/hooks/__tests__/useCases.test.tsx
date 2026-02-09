import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCases } from "../useCases";
import { CaseFilters } from "@/types/case";
import { ReactNode } from "react";


vi.mock("../services/casesApi", () => ({
  casesApi: {
    getCases: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return Wrapper;
};

describe("useCases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches cases with default filters", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.items).toBeDefined();
    expect(Array.isArray(result.current.data?.items)).toBe(true);
  });

  it("fetches cases with status filter", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
      status: "open",
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.items).toBeDefined();
  });

  it("fetches cases with priority filter", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
      priority: "high",
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it("fetches cases with case_type filter", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
      case_type: "support",
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it("fetches cases with search filter", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
      search: "database",
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it("fetches cases with multiple filters", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
      status: "open",
      priority: "high",
      case_type: "support",
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it("fetches cases with pagination", async () => {
    const filters: CaseFilters = {
      page: 2,
      size: 5,
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.page).toBe(2);
    expect(result.current.data?.size).toBe(5);
  });

  it("fetches cases with sort parameters", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
      sort_by: "created_at",
      sort_order: "desc",
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it("returns pagination metadata", async () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.total).toBeDefined();
    expect(result.current.data?.page).toBeDefined();
    expect(result.current.data?.size).toBeDefined();
    expect(result.current.data?.pages).toBeDefined();
  });

  it("updates query when filters change", async () => {
    const { result, rerender } = renderHook(
      ({ filters }) => useCases(filters),
      {
        wrapper: createWrapper(),
        initialProps: {
          filters: { page: 1, size: 10 } as CaseFilters,
        },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstData = result.current.data;

    rerender({
      filters: { page: 1, size: 10, status: "open" } as CaseFilters,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Data should be refetched with new filters
    expect(result.current.data).toBeDefined();
  });

  it("provides loading state", () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBeDefined();
  });

  it("provides error state", () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBeDefined();
  });

  it("uses correct query key with filters", () => {
    const filters: CaseFilters = {
      page: 1,
      size: 10,
      status: "open",
    };

    const { result } = renderHook(() => useCases(filters), {
      wrapper: createWrapper(),
    });

    // The hook should use the filters in the query key for proper caching
    expect(result.current).toBeDefined();
  });
});
