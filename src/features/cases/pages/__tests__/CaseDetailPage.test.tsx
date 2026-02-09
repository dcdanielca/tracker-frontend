import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { CaseDetailPage } from "../CaseDetailPage";
import { renderWithProviders } from "@/test/utils";
import { mockCaseWithQueries } from "@/test/mocks/data";

const mockNavigate = vi.fn();
const mockParams = { id: "1" };
const mockUseCase = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

vi.mock("../../hooks/useCase", () => ({
  useCase: (id: string) => mockUseCase(id),
}));

describe("CaseDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockUseCase.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders case detail when loaded", async () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    await waitFor(() => {
      expect(screen.getByText("Detalle del Caso")).toBeInTheDocument();
    });

    expect(screen.getByText(mockCaseWithQueries.title)).toBeInTheDocument();
  });

  it("shows error state when case not found", () => {
    mockUseCase.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<CaseDetailPage />);

    expect(screen.getByText("Caso no encontrado")).toBeInTheDocument();
    expect(
      screen.getByText(/el caso que buscas no existe o fue eliminado/i)
    ).toBeInTheDocument();
  });

  it("shows error state when data is null", () => {
    mockUseCase.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    expect(screen.getByText("Caso no encontrado")).toBeInTheDocument();
  });

  it("renders breadcrumb navigation", () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    expect(screen.getByText("Casos")).toBeInTheDocument();
    expect(screen.getByText("Detalle")).toBeInTheDocument();
  });

  it("renders back to cases button", () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    const backButtons = screen.getAllByRole("button", {
      name: /volver a casos/i,
    });
    expect(backButtons.length).toBeGreaterThan(0);
  });

  it("has link to cases list in breadcrumb", () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    const casesLink = screen.getAllByText("Casos")[0];
    expect(casesLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("has link to cases list in error state", () => {
    mockUseCase.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<CaseDetailPage />);

    const backButton = screen.getByRole("button", { name: /volver a casos/i });
    expect(backButton.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders page title", () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    expect(screen.getByText("Detalle del Caso")).toBeInTheDocument();
  });

  it("renders CaseDetail component with correct data", () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    expect(screen.getByText(mockCaseWithQueries.title)).toBeInTheDocument();
    expect(
      screen.getByText(mockCaseWithQueries.description)
    ).toBeInTheDocument();
  });

  it("displays multiple loading skeletons", () => {
    mockUseCase.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    const skeletons = screen.getAllByTestId("skeleton");
    // 2 CardSkeleton components, each with 4 skeleton elements
    expect(skeletons.length).toBe(8);
  });

  it("calls useCase hook with correct id", () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<CaseDetailPage />);

    expect(mockUseCase).toHaveBeenCalledWith("1");
  });

  it("wraps content in Container component", () => {
    mockUseCase.mockReturnValue({
      data: mockCaseWithQueries,
      isLoading: false,
      isError: false,
    });

    const { container } = renderWithProviders(<CaseDetailPage />);

    expect(container.querySelector(".container")).toBeInTheDocument();
  });

  it("displays error message with appropriate styling", () => {
    mockUseCase.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    const { container } = renderWithProviders(<CaseDetailPage />);

    const errorContainer = container.querySelector(".bg-red-50");
    expect(errorContainer).toBeInTheDocument();
  });
});
