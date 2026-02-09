import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormError } from "../FormError";

describe("FormError", () => {
  it("renders error message when provided", () => {
    render(<FormError message="This is an error" />);
    expect(screen.getByText("This is an error")).toBeInTheDocument();
  });

  it("does not render when message is not provided", () => {
    const { container } = render(<FormError />);
    expect(container.firstChild).toBeNull();
  });

  it("does not render when message is empty string", () => {
    const { container } = render(<FormError message="" />);
    expect(container.firstChild).toBeNull();
  });

  it("applies correct styles", () => {
    const { container } = render(<FormError message="Error" />);
    const errorDiv = container.firstChild;
    expect(errorDiv).toHaveClass(
      "rounded-lg",
      "bg-red-50",
      "p-4",
      "text-sm",
      "text-red-800"
    );
  });

  it("renders multiple errors correctly", () => {
    const { rerender } = render(<FormError message="Error 1" />);
    expect(screen.getByText("Error 1")).toBeInTheDocument();

    rerender(<FormError message="Error 2" />);
    expect(screen.getByText("Error 2")).toBeInTheDocument();
    expect(screen.queryByText("Error 1")).not.toBeInTheDocument();
  });
});
