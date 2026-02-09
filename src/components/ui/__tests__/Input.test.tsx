import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../Input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Username" placeholder="Enter username" />);
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    const { container } = render(<Input error="Error message" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-red-500");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    await user.type(input, "Hello World");

    expect(input).toHaveValue("Hello World");
  });

  it("handles onChange event", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input onChange={handleChange} placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    await user.type(input, "A");

    expect(handleChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
  });

  it("supports different input types", () => {
    const { rerender } = render(<Input type="email" />);
    let input = document.querySelector('input[type="email"]');
    expect(input).toBeInTheDocument();

    rerender(<Input type="password" />);
    input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();

    rerender(<Input type="number" />);
    input = document.querySelector('input[type="number"]');
    expect(input).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Input className="custom-class" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
