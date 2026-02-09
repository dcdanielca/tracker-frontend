import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../Pagination";

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("renders pagination component", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    // Check for the paragraph text content which includes all parts
    expect(screen.getByText(/Página/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
  });

  it("displays current page information", () => {
    const { container } = render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Check for the text content in the paragraph
    const pageInfo = container.querySelector(".text-sm.text-gray-700");
    expect(pageInfo).toBeInTheDocument();
    expect(pageInfo?.textContent).toContain("3");
    expect(pageInfo?.textContent).toContain("10");
  });

  it("renders previous and next buttons", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const anteriorButtons = screen.getAllByText("Anterior");
    const siguienteButtons = screen.getAllByText("Siguiente");

    expect(anteriorButtons.length).toBeGreaterThan(0);
    expect(siguienteButtons.length).toBeGreaterThan(0);
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const anteriorButtons = screen.getAllByText("Anterior");
    anteriorButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const siguienteButtons = screen.getAllByText("Siguiente");
    siguienteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("calls onPageChange with correct page when previous is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const anteriorButtons = screen.getAllByText("Anterior");
    await user.click(anteriorButtons[0]);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with correct page when next is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const siguienteButtons = screen.getAllByText("Siguiente");
    await user.click(siguienteButtons[0]);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("renders page number buttons", () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show pages around current page (1, 2, 3, 4, 5)
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("calls onPageChange with correct page when page number is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const page3Button = screen.getByRole("button", { name: "3" });
    await user.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("highlights current page button", () => {
    const { container } = render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const page3Button = screen.getByRole("button", { name: "3" });
    expect(page3Button).toHaveClass("bg-primary-600");
  });

  it("disables all buttons when isLoading is true", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        isLoading={true}
      />
    );

    const allButtons = screen.getAllByRole("button");
    allButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("shows limited page numbers for large page counts", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={100}
        onPageChange={mockOnPageChange}
      />
    );

    // Should only show pages around current page (max 5 pages)
    expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "11" })).toBeInTheDocument();

    // Should not show page 1 or page 100
    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "100" })).not.toBeInTheDocument();
  });

  it("shows correct pages when near the start", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("shows correct pages when near the end", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole("button", { name: "8" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "9" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
  });

  it("handles single page correctly", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    const anteriorButtons = screen.getAllByText("Anterior");
    const siguienteButtons = screen.getAllByText("Siguiente");

    anteriorButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
    siguienteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("does not call onPageChange when clicking disabled buttons", async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const anteriorButtons = screen.getAllByText("Anterior");
    await user.click(anteriorButtons[0]);

    expect(mockOnPageChange).not.toHaveBeenCalled();
  });
});
