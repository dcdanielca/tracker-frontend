import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CasesListPage } from "../CasesListPage";
import { renderWithProviders } from "@/test/utils";
import { mockCases } from "@/test/mocks/data";

const mockUseCases = vi.fn();
const mockUseCaseFilters = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock("../../hooks/useCases", () => ({
  useCases: (filters: any) => mockUseCases(filters),
}));

vi.mock("../../hooks/useCaseFilters", () => ({
  useCaseFilters: () => mockUseCaseFilters(),
}));

describe("CasesListPage", () => {
  const mockUpdateFilters = vi.fn();
  const mockResetFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCaseFilters.mockReturnValue({
      filters: { page: 1, size: 10 },
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
    });
  });

  it("renders page title and description", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    expect(screen.getByText("Casos")).toBeInTheDocument();
    expect(
      screen.getByText(/gestiona y da seguimiento a todos los casos/i)
    ).toBeInTheDocument();
  });

  it("renders new case button", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    const newCaseButton = screen.getByRole("button", { name: /nuevo caso/i });
    expect(newCaseButton).toBeInTheDocument();
    expect(newCaseButton.closest("a")).toHaveAttribute("href", "/cases/new");
  });

  it("shows loading state", () => {
    mockUseCases.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
  });

  it("renders case table with data", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    mockCases.forEach((caseItem) => {
      expect(screen.getByText(caseItem.title)).toBeInTheDocument();
    });
  });

  it("shows error state", () => {
    mockUseCases.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<CasesListPage />);

    expect(screen.getByText("Error al cargar los casos")).toBeInTheDocument();
    expect(
      screen.getByText(/por favor, intenta de nuevo más tarde/i)
    ).toBeInTheDocument();
  });

  it("renders CaseFilters component", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    expect(screen.getByPlaceholderText("Buscar casos...")).toBeInTheDocument();
  });

  it("passes filters to CaseFilters", () => {
    const mockFilters = { page: 1, size: 10, status: "open" as const };
    mockUseCaseFilters.mockReturnValue({
      filters: mockFilters,
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
    });

    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    const statusSelects = screen.getAllByRole("combobox");
    // Find the status select (second combobox in the filters)
    const statusSelect = statusSelects.find(
      (select) => select.querySelector('option[value=""]')?.textContent === "Filtrar por status"
    );
    expect(statusSelect).toHaveValue("open");
  });

  it("shows pagination when multiple pages", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 20, page: 1, size: 10, pages: 2 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("does not show pagination when single page", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("handles filter changes", async () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);
    const user = userEvent.setup();

    const statusSelects = screen.getAllByRole("combobox");
    // Find the status select (second combobox in the filters)
    const statusSelect = statusSelects.find(
      (select) => select.querySelector('option[value=""]')?.textContent === "Filtrar por status"
    )!;
    await user.selectOptions(statusSelect, "open");

    expect(mockUpdateFilters).toHaveBeenCalled();
  });

  it("handles pagination changes", async () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 20, page: 1, size: 10, pages: 2 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);
    const user = userEvent.setup();

    const nextButtons = screen.getAllByRole("button", { name: /siguiente/i });
    // Click the first "Siguiente" button
    await user.click(nextButtons[0]);

    expect(mockUpdateFilters).toHaveBeenCalledWith({ page: 2 });
  });

  it("wraps content in Container component", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 1, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    const { container } = renderWithProviders(<CasesListPage />);

    expect(container.querySelector(".container")).toBeInTheDocument();
  });

  it("renders empty table when no items", () => {
    mockUseCases.mockReturnValue({
      data: { items: [], total: 0, page: 1, size: 10, pages: 0 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    expect(screen.getByText("No se encontraron casos")).toBeInTheDocument();
  });

  it("passes loading state to pagination", () => {
    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 20, page: 1, size: 10, pages: 2 },
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    // During loading, table skeleton is shown instead of pagination
    expect(screen.getByTestId("table-skeleton")).toBeInTheDocument();
  });

  it("displays error with appropriate styling", () => {
    mockUseCases.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    const { container } = renderWithProviders(<CasesListPage />);

    const errorContainer = container.querySelector(".bg-red-50");
    expect(errorContainer).toBeInTheDocument();
  });

  it("uses correct filters from useCaseFilters hook", () => {
    const mockFilters = {
      page: 2,
      size: 10,
      status: "in_progress" as const,
      priority: "high" as const,
    };

    mockUseCaseFilters.mockReturnValue({
      filters: mockFilters,
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
    });

    mockUseCases.mockReturnValue({
      data: { items: mockCases, total: 4, page: 2, size: 10, pages: 1 },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CasesListPage />);

    expect(mockUseCases).toHaveBeenCalledWith(mockFilters);
  });
});
