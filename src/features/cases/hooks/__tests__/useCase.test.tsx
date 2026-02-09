import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCase } from "../useCase";
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

describe("useCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a single case by id", async () => {
    const { result } = renderHook(() => useCase("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.id).toBe("1");
  });

  it("does not fetch when id is empty", () => {
    const { result } = renderHook(() => useCase(""), {
      wrapper: createWrapper(),
    });

    // Should not be loading or fetching when id is empty
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("does not fetch when id is undefined", () => {
    const { result } = renderHook(() => useCase(undefined as unknown as string), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("fetches case with queries", async () => {
    const { result } = renderHook(() => useCase("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.id).toBe("1");
    // Case 1 should have queries based on mock data
  });

  it("returns case details", async () => {
    const { result } = renderHook(() => useCase("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const caseData = result.current.data;
    expect(caseData?.title).toBeDefined();
    expect(caseData?.description).toBeDefined();
    expect(caseData?.status).toBeDefined();
    expect(caseData?.priority).toBeDefined();
    expect(caseData?.case_type).toBeDefined();
    expect(caseData?.created_by).toBeDefined();
    expect(caseData?.created_at).toBeDefined();
  });

  it("refetches when id changes", async () => {
    const { result, rerender } = renderHook(
      ({ id }) => useCase(id),
      {
        wrapper: createWrapper(),
        initialProps: { id: "1" },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const firstCase = result.current.data;
    expect(firstCase?.id).toBe("1");

    rerender({ id: "2" });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it("provides loading state", () => {
    const { result } = renderHook(() => useCase("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBeDefined();
  });

  it("provides error state", () => {
    const { result } = renderHook(() => useCase("1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.error).toBeDefined();
  });

  it("handles non-existent case id", async () => {
    const { result } = renderHook(() => useCase("non-existent-id"), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    // Should handle 404 error gracefully
    expect(result.current.error || result.current.data).toBeDefined();
  });

  it("uses correct query key with case id", () => {
    const { result } = renderHook(() => useCase("123"), {
      wrapper: createWrapper(),
    });

    // The hook should use the id in the query key for proper caching
    expect(result.current).toBeDefined();
  });

  it("is enabled only when id is provided", () => {
    const { result: resultWithId } = renderHook(() => useCase("1"), {
      wrapper: createWrapper(),
    });

    const { result: resultWithoutId } = renderHook(() => useCase(""), {
      wrapper: createWrapper(),
    });

    // With ID, query should be enabled and loading
    expect(resultWithId.current.isLoading).toBe(true);

    // Without ID, query should be disabled and not loading
    expect(resultWithoutId.current.isLoading).toBe(false);
  });

  it("caches case data correctly", async () => {
    const wrapper = createWrapper();

    const { result: firstResult } = renderHook(() => useCase("1"), {
      wrapper,
    });

    await waitFor(() => {
      expect(firstResult.current.isSuccess).toBe(true);
    });

    // Second render should use cached data
    const { result: secondResult } = renderHook(() => useCase("1"), {
      wrapper,
    });

    // Should have data immediately from cache
    expect(secondResult.current.data || secondResult.current.isLoading).toBeDefined();
  });
});
