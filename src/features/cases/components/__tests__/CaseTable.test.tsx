import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CaseTable } from "../CaseTable";
import { mockCases } from "@/test/mocks/data";
import { renderWithProviders } from "@/test/utils";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CaseTable", () => {
  it("renders table with cases", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("displays empty state when no cases", () => {
    renderWithProviders(<CaseTable cases={[]} />);

    expect(screen.getByText("No se encontraron casos")).toBeInTheDocument();
    expect(
      screen.getByText(/intenta ajustar los filtros o crea un nuevo caso/i)
    ).toBeInTheDocument();
  });

  it("renders table headers", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByText("Prioridad")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
    expect(screen.getByText("Creador")).toBeInTheDocument();
    expect(screen.getByText("Fecha")).toBeInTheDocument();
    expect(screen.getByText("Queries")).toBeInTheDocument();
  });

  it("displays case titles", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    mockCases.forEach((caseItem) => {
      expect(screen.getByText(caseItem.title)).toBeInTheDocument();
    });
  });

  it("displays truncated descriptions", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    mockCases.forEach((caseItem) => {
      const truncated = caseItem.description.substring(0, 50);
      expect(screen.getByText(new RegExp(truncated))).toBeInTheDocument();
    });
  });

  it("displays case type labels", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    const soporteElements = screen.getAllByText("Soporte");
    expect(soporteElements.length).toBe(2); // Two cases with "support" type
    expect(screen.getByText("Requerimiento")).toBeInTheDocument();
    expect(screen.getByText("Investigación")).toBeInTheDocument();
  });

  it("displays priority badges", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("Media")).toBeInTheDocument();
    expect(screen.getByText("Baja")).toBeInTheDocument();
    expect(screen.getByText("Crítica")).toBeInTheDocument();
  });

  it("displays status badges", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    expect(screen.getByText("Abierto")).toBeInTheDocument();
    expect(screen.getByText("En Progreso")).toBeInTheDocument();
    expect(screen.getByText("Resuelto")).toBeInTheDocument();
    expect(screen.getByText("Cerrado")).toBeInTheDocument();
  });

  it("displays created by information", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    mockCases.forEach((caseItem) => {
      expect(screen.getByText(caseItem.created_by)).toBeInTheDocument();
    });
  });

  it("displays queries count", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    mockCases.forEach((caseItem) => {
      expect(
        screen.getByText(caseItem.queries_count.toString())
      ).toBeInTheDocument();
    });
  });

  it("navigates to case detail when row clicked", async () => {
    renderWithProviders(<CaseTable cases={mockCases} />);
    const user = userEvent.setup();

    const firstCaseTitle = screen.getByText(mockCases[0].title);
    await user.click(firstCaseTitle);

    expect(mockNavigate).toHaveBeenCalledWith(`/cases/${mockCases[0].id}`);
  });

  it("applies hover effect on table rows", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    const rows = screen.getAllByRole("row");
    // Skip header row
    const dataRows = rows.slice(1);

    dataRows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-gray-50");
      expect(row).toHaveClass("cursor-pointer");
    });
  });

  it("renders correct number of rows", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    const rows = screen.getAllByRole("row");
    // +1 for header row
    expect(rows).toHaveLength(mockCases.length + 1);
  });

  it("displays formatted dates", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    // Dates should be formatted by formatRelativeDate utility
    expect(screen.getAllByText(/2024/).length).toBeGreaterThan(0);
  });

  it("handles single case correctly", () => {
    const singleCase = [mockCases[0]];
    renderWithProviders(<CaseTable cases={singleCase} />);

    expect(screen.getByText(singleCase[0].title)).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2); // header + 1 data row
  });

  it("navigates to correct case detail URL", async () => {
    renderWithProviders(<CaseTable cases={mockCases} />);
    const user = userEvent.setup();

    for (const caseItem of mockCases) {
      mockNavigate.mockClear();
      const caseTitle = screen.getByText(caseItem.title);
      await user.click(caseTitle);

      expect(mockNavigate).toHaveBeenCalledWith(`/cases/${caseItem.id}`);
    }
  });

  it("shows priority colors correctly", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    const highPriorityBadge = screen.getByText("Alta");
    expect(highPriorityBadge.className).toContain("bg-red-100");

    const mediumPriorityBadge = screen.getByText("Media");
    expect(mediumPriorityBadge.className).toContain("bg-yellow-100");
  });

  it("shows status colors correctly", () => {
    renderWithProviders(<CaseTable cases={mockCases} />);

    const openStatusBadge = screen.getByText("Abierto");
    expect(openStatusBadge.className).toContain("bg-green-100");

    const inProgressStatusBadge = screen.getByText("En Progreso");
    expect(inProgressStatusBadge.className).toContain("bg-yellow-100");
  });
});
