import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent } from "../Card";

describe("Card", () => {
  it("renders correctly", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("custom-card");
  });

  it("applies base styles", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass("rounded-lg", "border", "bg-white", "shadow-sm");
  });

  it("renders children correctly", () => {
    render(
      <Card>
        <div>Child 1</div>
        <div>Child 2</div>
      </Card>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });
});

describe("CardHeader", () => {
  it("renders correctly", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardHeader className="custom-header">Header</CardHeader>
    );
    const header = container.firstChild;
    expect(header).toHaveClass("custom-header");
  });

  it("applies base styles", () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    const header = container.firstChild;
    expect(header).toHaveClass("p-6 pb-4");
  });
});

describe("CardTitle", () => {
  it("renders correctly", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardTitle className="custom-title">Title</CardTitle>
    );
    const title = container.firstChild;
    expect(title).toHaveClass("custom-title");
  });

  it("applies base styles", () => {
    const { container } = render(<CardTitle>Title</CardTitle>);
    const title = container.firstChild;
    expect(title).toHaveClass("text-xl", "font-semibold", "leading-none");
  });
});

describe("CardContent", () => {
  it("renders correctly", () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <CardContent className="custom-content">Content</CardContent>
    );
    const content = container.firstChild;
    expect(content).toHaveClass("custom-content");
  });

  it("applies base styles", () => {
    const { container } = render(<CardContent>Content</CardContent>);
    const content = container.firstChild;
    expect(content).toHaveClass("p-6", "pt-0");
  });
});

describe("Card - Full composition", () => {
  it("renders complete card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>Card body content</CardContent>
      </Card>
    );

    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Card body content")).toBeInTheDocument();
  });
});
