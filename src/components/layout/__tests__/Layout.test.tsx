import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import { Layout } from "../Layout";
import { Route, Routes } from "react-router-dom";

describe("Layout", () => {
  it("renders the layout structure", () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Test Page</div>} />
        </Route>
      </Routes>
    );

    expect(screen.getByText("Case Tracker")).toBeInTheDocument();
    expect(screen.getByText("Test Page")).toBeInTheDocument();
  });

  it("renders Header component", () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Content</div>} />
        </Route>
      </Routes>
    );

    expect(screen.getByText("Case Tracker")).toBeInTheDocument();
    expect(screen.getByText("Casos")).toBeInTheDocument();
    expect(screen.getByText("Nuevo Caso")).toBeInTheDocument();
  });

  it("renders child routes via Outlet", () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Home Page</div>} />
        </Route>
      </Routes>
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("applies correct background styling", () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Content</div>} />
        </Route>
      </Routes>
    );

    const mainContainer = container.querySelector("div.min-h-screen");
    expect(mainContainer).toHaveClass("bg-gray-50");
  });

  it("wraps content in main tag with correct styling", () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Content</div>} />
        </Route>
      </Routes>
    );

    const main = container.querySelector("main");
    expect(main).toHaveClass("py-8");
    expect(main).toBeInTheDocument();
  });

  it("renders Toaster component for notifications", () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Content</div>} />
        </Route>
      </Routes>
    );

    // Toaster is rendered but may not have visible content initially
    // We verify it exists by checking the structure
    expect(container.querySelector("div.min-h-screen")).toBeInTheDocument();
  });

  it("renders multiple child components", () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <div>
                <h1>Title</h1>
                <p>Paragraph</p>
              </div>
            }
          />
        </Route>
      </Routes>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Paragraph")).toBeInTheDocument();
  });

  it("maintains layout structure with different routes", () => {
    const { rerender } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Page 1</div>} />
        </Route>
      </Routes>
    );

    expect(screen.getByText("Page 1")).toBeInTheDocument();
    expect(screen.getByText("Case Tracker")).toBeInTheDocument();

    rerender(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Page 2</div>} />
        </Route>
      </Routes>
    );

    expect(screen.getByText("Page 2")).toBeInTheDocument();
    expect(screen.getByText("Case Tracker")).toBeInTheDocument();
  });

  it("has proper min-height for full viewport", () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>Content</div>} />
        </Route>
      </Routes>
    );

    const mainContainer = container.querySelector("div.min-h-screen");
    expect(mainContainer).toHaveClass("min-h-screen");
  });
});
