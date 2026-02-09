import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "../Container";

describe("Container", () => {
  it("renders children correctly", () => {
    render(
      <Container>
        <div>Test content</div>
      </Container>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies default container classes", () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("mx-auto");
    expect(containerDiv).toHaveClass("max-w-7xl");
    expect(containerDiv).toHaveClass("px-4");
    expect(containerDiv).toHaveClass("sm:px-6");
    expect(containerDiv).toHaveClass("lg:px-8");
  });

  it("accepts and merges custom className", () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("custom-class");
    expect(containerDiv).toHaveClass("mx-auto");
    expect(containerDiv).toHaveClass("max-w-7xl");
  });

  it("renders multiple children", () => {
    render(
      <Container>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </Container>
    );
    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
    expect(screen.getByText("Third child")).toBeInTheDocument();
  });

  it("renders nested components", () => {
    render(
      <Container>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
      </Container>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
  });

  it("applies additional Tailwind classes correctly", () => {
    const { container } = render(
      <Container className="py-8 bg-white">
        <div>Content</div>
      </Container>
    );
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("py-8");
    expect(containerDiv).toHaveClass("bg-white");
  });
});
