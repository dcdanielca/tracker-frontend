import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../Select";

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Select", () => {
  it("renders correctly", () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Select label="Choose option" options={mockOptions} />);
    expect(screen.getByLabelText("Choose option")).toBeInTheDocument();
    expect(screen.getByText("Choose option")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select options={mockOptions} />);

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("renders placeholder option", () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByText("Seleccionar...")).toBeInTheDocument();
  });

  it("renders custom placeholder", () => {
    render(<Select options={mockOptions} placeholder="Pick one" />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<Select options={mockOptions} error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies error styles when error is present", () => {
    render(<Select options={mockOptions} error="Error message" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("border-red-500");
  });

  it("handles onChange event", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Select options={mockOptions} onChange={handleChange} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "option2");

    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue("option2");
  });

  it("can be disabled", () => {
    render(<Select options={mockOptions} disabled />);
    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Select options={mockOptions} className="custom-class" />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Select options={mockOptions} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it("maintains selected value", async () => {
    const user = userEvent.setup();
    render(<Select options={mockOptions} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    await user.selectOptions(select, "option1");

    expect(select.value).toBe("option1");
  });
});
