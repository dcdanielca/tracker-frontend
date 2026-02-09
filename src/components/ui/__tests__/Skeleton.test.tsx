import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "../Skeleton";

describe("Skeleton", () => {
  it("renders correctly", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild;
    expect(skeleton).toBeInTheDocument();
  });

  it("applies base animation class", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild;
    expect(skeleton).toHaveClass("animate-pulse");
  });

  it("applies base background class", () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild;
    expect(skeleton).toHaveClass("bg-gray-200");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    const skeleton = container.firstChild;
    expect(skeleton).toHaveClass("custom-skeleton");
  });

  it("applies custom height", () => {
    const { container } = render(<Skeleton className="h-20" />);
    const skeleton = container.firstChild;
    expect(skeleton).toHaveClass("h-20");
  });

  it("applies custom width", () => {
    const { container } = render(<Skeleton className="w-40" />);
    const skeleton = container.firstChild;
    expect(skeleton).toHaveClass("w-40");
  });

  it("renders rounded variant", () => {
    const { container } = render(<Skeleton className="rounded-full" />);
    const skeleton = container.firstChild;
    expect(skeleton).toHaveClass("rounded-full");
  });
});
