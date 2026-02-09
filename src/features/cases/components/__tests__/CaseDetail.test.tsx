import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseDetail } from "../CaseDetail";
import { mockCaseWithQueries } from "@/test/mocks/data";

describe("CaseDetail", () => {
  it("renders case information correctly", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(screen.getByText(mockCaseWithQueries.title)).toBeInTheDocument();
    expect(
      screen.getByText(mockCaseWithQueries.description)
    ).toBeInTheDocument();
    expect(screen.getByText(mockCaseWithQueries.created_by)).toBeInTheDocument();
  });

  it("displays case ID", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(
      screen.getByText(`Caso #${mockCaseWithQueries.id}`)
    ).toBeInTheDocument();
  });

  it("renders status badge with correct label", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(screen.getByText("Abierto")).toBeInTheDocument();
  });

  it("renders priority badge with correct label", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(screen.getByText("Alta")).toBeInTheDocument();
  });

  it("renders case type label", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(screen.getByText("Soporte")).toBeInTheDocument();
  });

  it("displays queries count", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(
      screen.getByText(`Queries (${mockCaseWithQueries.queries.length})`)
    ).toBeInTheDocument();
  });

  it("renders all queries when present", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(screen.getByText("Query 1")).toBeInTheDocument();
    expect(screen.getByText("Query 2")).toBeInTheDocument();
  });

  it("displays query details correctly", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    const firstQuery = mockCaseWithQueries.queries[0];

    expect(screen.getByText(firstQuery.database_name)).toBeInTheDocument();
    expect(screen.getByText(firstQuery.schema_name)).toBeInTheDocument();
    expect(screen.getByText(firstQuery.executed_by)).toBeInTheDocument();
    expect(screen.getByText(firstQuery.query_text)).toBeInTheDocument();
  });

  it("shows empty state when no queries", () => {
    const caseWithoutQueries = {
      ...mockCaseWithQueries,
      queries: [],
    };

    render(<CaseDetail caseData={caseWithoutQueries} />);

    expect(
      screen.getByText("No hay queries asociadas a este caso")
    ).toBeInTheDocument();
  });

  it("renders query SQL text in code block", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    const preElements = screen.getAllByText(
      mockCaseWithQueries.queries[0].query_text
    );
    expect(preElements.length).toBeGreaterThan(0);
  });

  it("displays execution time for queries", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(screen.getByText("45ms")).toBeInTheDocument();
  });

  it("displays rows affected for queries", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("5,000")).toBeInTheDocument();
  });

  it("handles null execution time", () => {
    const caseWithNullTime = {
      ...mockCaseWithQueries,
      queries: [
        {
          ...mockCaseWithQueries.queries[0],
          execution_time_ms: null,
        },
      ],
    };

    render(<CaseDetail caseData={caseWithNullTime} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("handles null rows affected", () => {
    const caseWithNullRows = {
      ...mockCaseWithQueries,
      queries: [
        {
          ...mockCaseWithQueries.queries[0],
          rows_affected: null,
        },
      ],
    };

    render(<CaseDetail caseData={caseWithNullRows} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders multiple queries with correct numbering", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    mockCaseWithQueries.queries.forEach((_, index) => {
      expect(screen.getByText(`Query ${index + 1}`)).toBeInTheDocument();
    });
  });

  it("displays formatted dates", () => {
    render(<CaseDetail caseData={mockCaseWithQueries} />);

    // Dates should be formatted by formatDate utility
    expect(screen.getAllByText(/2024/).length).toBeGreaterThan(0);
  });
});
