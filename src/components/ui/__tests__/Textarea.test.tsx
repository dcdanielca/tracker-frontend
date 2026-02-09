import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "../Textarea";

describe("Textarea", () => {
  it("renders correctly", () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Textarea label="Description" placeholder="Enter description" />);
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    render(<Textarea error="Error message" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("border-red-500");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText("Enter text");
    await user.type(textarea, "Hello World");

    expect(textarea).toHaveValue("Hello World");
  });

  it("handles onChange event", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Textarea onChange={handleChange} placeholder="Enter text" />);

    const textarea = screen.getByPlaceholderText("Enter text");
    await user.type(textarea, "A");

    expect(handleChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    const textarea = screen.getByPlaceholderText("Disabled textarea");
    expect(textarea).toBeDisabled();
  });

  it("supports rows attribute", () => {
    render(<Textarea rows={5} />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("applies custom className", () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("handles multiline text", async () => {
    const user = userEvent.setup();
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    const multilineText = "Line 1\nLine 2\nLine 3";
    await user.type(textarea, multilineText);

    expect(textarea).toHaveValue(multilineText);
  });
});
