import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../Spinner";

describe("Spinner", () => {
  it("renders correctly", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("has accessible sr-only text", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Spinner className="custom-spinner" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-spinner");
  });

  it("applies size variations", () => {
    const { rerender } = render(<Spinner size="sm" />);
    let spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-4", "w-4");

    rerender(<Spinner size="md" />);
    spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-8", "w-8");

    rerender(<Spinner size="lg" />);
    spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("has animation class", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("animate-spin");
  });
});
