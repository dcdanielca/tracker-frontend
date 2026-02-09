import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CaseFilters } from "../CaseFilters";
import { CaseFilters as CaseFiltersType } from "@/types/case";

// Helper function to get select by its placeholder option text
const getSelectByPlaceholder = (placeholderText: string) => {
  const selects = screen.getAllByRole("combobox");
  return selects.find((select) =>
    select.querySelector('option[value=""]')?.textContent === placeholderText
  );
};

describe("CaseFilters", () => {
  const mockFilters: CaseFiltersType = {
    page: 1,
    size: 10,
  };

  const mockOnFiltersChange = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all filter inputs", () => {
    render(
      <CaseFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByPlaceholderText("Buscar casos...")).toBeInTheDocument();
    expect(getSelectByPlaceholder("Filtrar por status")).toBeDefined();
    expect(getSelectByPlaceholder("Filtrar por prioridad")).toBeDefined();
    expect(getSelectByPlaceholder("Filtrar por tipo")).toBeDefined();
  });

  it("does not show reset button when no filters active", () => {
    render(
      <CaseFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    expect(
      screen.queryByRole("button", { name: /limpiar filtros/i })
    ).not.toBeInTheDocument();
  });

  it("shows reset button when filters are active", () => {
    const filtersWithStatus = {
      ...mockFilters,
      status: "open" as const,
    };

    render(
      <CaseFilters
        filters={filtersWithStatus}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    expect(
      screen.getByRole("button", { name: /limpiar filtros/i })
    ).toBeInTheDocument();
  });

  it("handles search input change with debounce", async () => {
    render(
      <CaseFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    // Wait for initial mount effect to complete
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: undefined });
    });

    // Clear the mock after initial mount
    mockOnFiltersChange.mockClear();

    const searchInput = screen.getByPlaceholderText("Buscar casos...");
    const user = userEvent.setup();

    await user.type(searchInput, "test");

    // Should not call immediately (debounced)
    expect(mockOnFiltersChange).not.toHaveBeenCalled();

    // Should call after debounce delay (500ms)
    await waitFor(
      () => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: "test" });
      },
      { timeout: 600 }
    );
  });

  it("handles status filter change", async () => {
    render(
      <CaseFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const statusSelect = getSelectByPlaceholder("Filtrar por status")!;
    const user = userEvent.setup();

    await user.selectOptions(statusSelect, "open");

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ status: "open" });
  });

  it("handles priority filter change", async () => {
    render(
      <CaseFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const prioritySelect = getSelectByPlaceholder("Filtrar por prioridad")!;
    const user = userEvent.setup();

    await user.selectOptions(prioritySelect, "high");

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ priority: "high" });
  });

  it("handles case type filter change", async () => {
    render(
      <CaseFilters
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const caseTypeSelect = getSelectByPlaceholder("Filtrar por tipo")!;
    const user = userEvent.setup();

    await user.selectOptions(caseTypeSelect, "support");

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ case_type: "support" });
  });

  it("handles reset button click", async () => {
    const filtersWithMultiple = {
      ...mockFilters,
      status: "open" as const,
      priority: "high" as const,
    };

    render(
      <CaseFilters
        filters={filtersWithMultiple}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const resetButton = screen.getByRole("button", {
      name: /limpiar filtros/i,
    });
    const user = userEvent.setup();

    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("clears filter when empty option selected", async () => {
    const filtersWithStatus = {
      ...mockFilters,
      status: "open" as const,
    };

    render(
      <CaseFilters
        filters={filtersWithStatus}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const statusSelect = getSelectByPlaceholder("Filtrar por status")!;
    const user = userEvent.setup();

    await user.selectOptions(statusSelect, "");

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ status: undefined });
  });

  it("shows reset button with search filter", () => {
    const filtersWithSearch = {
      ...mockFilters,
      search: "test",
    };

    render(
      <CaseFilters
        filters={filtersWithSearch}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    expect(
      screen.getByRole("button", { name: /limpiar filtros/i })
    ).toBeInTheDocument();
  });

  it("initializes search input with filter value", () => {
    const filtersWithSearch = {
      ...mockFilters,
      search: "initial search",
    };

    render(
      <CaseFilters
        filters={filtersWithSearch}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar casos...");
    expect(searchInput).toHaveValue("initial search");
  });

  it("initializes selects with filter values", () => {
    const filtersWithAll = {
      ...mockFilters,
      status: "open" as const,
      priority: "high" as const,
      case_type: "support" as const,
    };

    render(
      <CaseFilters
        filters={filtersWithAll}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    expect(getSelectByPlaceholder("Filtrar por status")).toHaveValue("open");
    expect(getSelectByPlaceholder("Filtrar por prioridad")).toHaveValue("high");
    expect(getSelectByPlaceholder("Filtrar por tipo")).toHaveValue("support");
  });

  it("handles empty search by passing undefined", async () => {
    const filtersWithSearch = {
      ...mockFilters,
      search: "test",
    };

    render(
      <CaseFilters
        filters={filtersWithSearch}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar casos...");
    const user = userEvent.setup();

    await user.clear(searchInput);

    await waitFor(
      () => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: undefined });
      },
      { timeout: 600 }
    );
  });
});
