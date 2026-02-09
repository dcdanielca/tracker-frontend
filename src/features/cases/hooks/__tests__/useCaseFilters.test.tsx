import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCaseFilters } from "../useCaseFilters";
import { ReactNode } from "react";

const createWrapper = () => {
  function Wrapper({ children }: { children: ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }
  return Wrapper;
};

describe("useCaseFilters", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("initializes with default filters", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filters.page).toBe(1);
    expect(result.current.filters.size).toBe(10);
    expect(result.current.filters.status).toBeUndefined();
    expect(result.current.filters.priority).toBeUndefined();
    expect(result.current.filters.case_type).toBeUndefined();
    expect(result.current.filters.search).toBeUndefined();
  });

  it("reads filters from URL params", () => {
    window.history.pushState({}, "", "/?page=2&status=open&priority=high");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filters.page).toBe(2);
    expect(result.current.filters.status).toBe("open");
    expect(result.current.filters.priority).toBe("high");
  });

  it("updates filters and URL params", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ status: "in_progress" });
    });

    expect(result.current.filters.status).toBe("in_progress");
    expect(window.location.search).toContain("status=in_progress");
  });

  it("updates multiple filters at once", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({
        status: "resolved",
        priority: "critical",
        case_type: "support",
      });
    });

    expect(result.current.filters.status).toBe("resolved");
    expect(result.current.filters.priority).toBe("critical");
    expect(result.current.filters.case_type).toBe("support");
  });

  it("resets to page 1 when filters change", () => {
    window.history.pushState({}, "", "/?page=5");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filters.page).toBe(5);

    act(() => {
      result.current.updateFilters({ status: "open" });
    });

    expect(result.current.filters.page).toBe(1);
  });

  it("does not reset page when explicitly updating page", () => {
    window.history.pushState({}, "", "/?page=1&status=open");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ page: 3 });
    });

    expect(result.current.filters.page).toBe(3);
    expect(result.current.filters.status).toBe("open");
  });

  it("removes filter when set to undefined", () => {
    window.history.pushState({}, "", "/?status=open&priority=high");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ status: undefined });
    });

    expect(result.current.filters.status).toBeUndefined();
    expect(result.current.filters.priority).toBe("high");
    expect(window.location.search).not.toContain("status");
  });

  it("removes filter when set to empty string", () => {
    window.history.pushState({}, "", "/?search=test");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ search: "" });
    });

    expect(result.current.filters.search).toBeUndefined();
    expect(window.location.search).not.toContain("search");
  });

  it("removes filter when set to null", () => {
    window.history.pushState({}, "", "/?priority=high");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ priority: null as any });
    });

    expect(result.current.filters.priority).toBeUndefined();
    expect(window.location.search).not.toContain("priority");
  });

  it("resets all filters", () => {
    window.history.pushState(
      {},
      "",
      "/?page=3&status=open&priority=high&search=test"
    );

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters.page).toBe(1);
    expect(result.current.filters.status).toBeUndefined();
    expect(result.current.filters.priority).toBeUndefined();
    expect(result.current.filters.search).toBeUndefined();
    expect(window.location.search).toBe("");
  });

  it("handles search filter", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ search: "database error" });
    });

    expect(result.current.filters.search).toBe("database error");
    expect(window.location.search).toContain("search=database+error");
  });

  it("handles sort_by filter", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ sort_by: "created_at" });
    });

    expect(result.current.filters.sort_by).toBe("created_at");
    expect(window.location.search).toContain("sort_by=created_at");
  });

  it("handles sort_order filter", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ sort_order: "desc" });
    });

    expect(result.current.filters.sort_order).toBe("desc");
    expect(window.location.search).toContain("sort_order=desc");
  });

  it("handles case_type filter with different types", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ case_type: "requirement" });
    });

    expect(result.current.filters.case_type).toBe("requirement");

    act(() => {
      result.current.updateFilters({ case_type: "investigation" });
    });

    expect(result.current.filters.case_type).toBe("investigation");
  });

  it("preserves existing filters when updating one filter", () => {
    window.history.pushState({}, "", "/?status=open&priority=high");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateFilters({ case_type: "support" });
    });

    expect(result.current.filters.status).toBe("open");
    expect(result.current.filters.priority).toBe("high");
    expect(result.current.filters.case_type).toBe("support");
  });

  it("always includes size in filters", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filters.size).toBe(10);

    act(() => {
      result.current.updateFilters({ status: "open" });
    });

    expect(result.current.filters.size).toBe(10);
  });

  it("converts page number from string to number", () => {
    window.history.pushState({}, "", "/?page=7");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filters.page).toBe(7);
    expect(typeof result.current.filters.page).toBe("number");
  });

  it("defaults to page 1 when page param is invalid", () => {
    window.history.pushState({}, "", "/?page=invalid");

    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.filters.page).toBe(1);
  });

  it("handles all status types", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    const statuses: Array<"open" | "in_progress" | "resolved" | "closed"> = [
      "open",
      "in_progress",
      "resolved",
      "closed",
    ];

    statuses.forEach((status) => {
      act(() => {
        result.current.updateFilters({ status });
      });

      expect(result.current.filters.status).toBe(status);
    });
  });

  it("handles all priority types", () => {
    const { result } = renderHook(() => useCaseFilters(), {
      wrapper: createWrapper(),
    });

    const priorities: Array<"low" | "medium" | "high" | "critical"> = [
      "low",
      "medium",
      "high",
      "critical",
    ];

    priorities.forEach((priority) => {
      act(() => {
        result.current.updateFilters({ priority });
      });

      expect(result.current.filters.priority).toBe(priority);
    });
  });
});
