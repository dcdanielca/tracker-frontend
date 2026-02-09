import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { CreateCasePage } from "../CreateCasePage";
import { renderWithProviders } from "@/test/utils";

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

vi.mock("../../hooks/useCreateCase", () => ({
  useCreateCase: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe("CreateCasePage", () => {
  it("renders page title", () => {
    renderWithProviders(<CreateCasePage />);

    expect(screen.getByText("Crear Nuevo Caso")).toBeInTheDocument();
  });

  it("renders page description", () => {
    renderWithProviders(<CreateCasePage />);

    expect(
      screen.getByText(/completa la información del caso y sus queries asociadas/i)
    ).toBeInTheDocument();
  });

  it("renders breadcrumb navigation", () => {
    renderWithProviders(<CreateCasePage />);

    expect(screen.getByText("Casos")).toBeInTheDocument();
    expect(screen.getByText("Nuevo Caso")).toBeInTheDocument();
  });

  it("has link to cases list in breadcrumb", () => {
    renderWithProviders(<CreateCasePage />);

    const casesLink = screen.getByText("Casos");
    expect(casesLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders CaseForm component", () => {
    renderWithProviders(<CreateCasePage />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de caso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prioridad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/creado por/i)).toBeInTheDocument();
  });

  it("wraps content in Container component", () => {
    const { container } = renderWithProviders(<CreateCasePage />);

    expect(container.querySelector(".container")).toBeInTheDocument();
  });

  it("renders form submit button", () => {
    renderWithProviders(<CreateCasePage />);

    expect(
      screen.getByRole("button", { name: /crear caso/i })
    ).toBeInTheDocument();
  });

  it("renders form cancel button", () => {
    renderWithProviders(<CreateCasePage />);

    expect(
      screen.getByRole("button", { name: /cancelar/i })
    ).toBeInTheDocument();
  });

  it("displays breadcrumb separator", () => {
    renderWithProviders(<CreateCasePage />);

    expect(screen.getByText("/")).toBeInTheDocument();
  });

  it("breadcrumb link has hover effect class", () => {
    renderWithProviders(<CreateCasePage />);

    const casesLink = screen.getByText("Casos");
    expect(casesLink).toHaveClass("hover:text-primary-600");
  });

  it("renders initial query field from CaseForm", () => {
    renderWithProviders(<CreateCasePage />);

    expect(screen.getByText("Query 1")).toBeInTheDocument();
  });

  it("renders all required form sections", () => {
    renderWithProviders(<CreateCasePage />);

    expect(screen.getByText("Información del Caso")).toBeInTheDocument();
    expect(screen.getByText("Queries")).toBeInTheDocument();
  });

  it("has correct page structure with spacing", () => {
    const { container } = renderWithProviders(<CreateCasePage />);

    const contentDiv = container.querySelector(".space-y-6");
    expect(contentDiv).toBeInTheDocument();
  });

  it("renders add query button from CaseForm", () => {
    renderWithProviders(<CreateCasePage />);

    expect(
      screen.getByRole("button", { name: /agregar query/i })
    ).toBeInTheDocument();
  });

  it("displays case type select options", () => {
    renderWithProviders(<CreateCasePage />);

    const caseTypeSelect = screen.getByLabelText(/tipo de caso/i);
    expect(caseTypeSelect).toBeInTheDocument();
  });

  it("displays priority select options", () => {
    renderWithProviders(<CreateCasePage />);

    const prioritySelect = screen.getByLabelText(/prioridad/i);
    expect(prioritySelect).toBeInTheDocument();
  });

  it("renders all form elements", () => {
    renderWithProviders(<CreateCasePage />);

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const submitButton = screen.getByRole("button", { name: /crear caso/i });

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});
