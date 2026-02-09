import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "../FormField";

describe("FormField", () => {
  it("renders correctly with label and children", () => {
    render(
      <FormField label="Username">
        <input placeholder="Enter username" />
      </FormField>
    );

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("renders required indicator when required is true", () => {
    render(
      <FormField label="Email" required>
        <input />
      </FormField>
    );

    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass("text-red-500");
  });

  it("does not render required indicator when required is false", () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>
    );

    const asterisk = screen.queryByText("*");
    expect(asterisk).not.toBeInTheDocument();
  });

  it("renders error message when error is provided", () => {
    render(
      <FormField label="Password" error="Password is required">
        <input />
      </FormField>
    );

    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("does not render error message when error is not provided", () => {
    const { container } = render(
      <FormField label="Password">
        <input />
      </FormField>
    );

    const errorElement = container.querySelector(".text-red-600");
    expect(errorElement).not.toBeInTheDocument();
  });

  it("applies correct error styles", () => {
    render(
      <FormField label="Field" error="Error message">
        <input />
      </FormField>
    );

    const error = screen.getByText("Error message");
    expect(error).toHaveClass("mt-1", "text-sm", "text-red-600");
  });

  it("renders children correctly", () => {
    render(
      <FormField label="Test">
        <div>Custom child component</div>
      </FormField>
    );

    expect(screen.getByText("Custom child component")).toBeInTheDocument();
  });
});
