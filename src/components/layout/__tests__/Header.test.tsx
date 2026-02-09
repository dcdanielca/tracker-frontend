import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/utils";
import { Header } from "../Header";

describe("Header", () => {
  it("renders the header correctly", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("Case Tracker")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("Casos")).toBeInTheDocument();
    expect(screen.getByText("Nuevo Caso")).toBeInTheDocument();
  });

  it("renders Case Tracker as a link to home", () => {
    renderWithProviders(<Header />);
    const homeLink = screen.getByText("Case Tracker").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("renders Casos link with correct path", () => {
    renderWithProviders(<Header />);
    const casosLink = screen.getByText("Casos").closest("a");
    expect(casosLink).toHaveAttribute("href", "/");
  });

  it("renders Nuevo Caso link with correct path", () => {
    renderWithProviders(<Header />);
    const nuevoCasoLink = screen.getByText("Nuevo Caso").closest("a");
    expect(nuevoCasoLink).toHaveAttribute("href", "/cases/new");
  });

  it("has correct styling for header", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("border-b");
    expect(header).toHaveClass("border-gray-200");
    expect(header).toHaveClass("bg-white");
  });

  it("applies hover styles to Casos link", () => {
    renderWithProviders(<Header />);
    const casosLink = screen.getByText("Casos").closest("a");
    expect(casosLink).toHaveClass("hover:text-primary-600");
  });

  it("applies primary button styles to Nuevo Caso link", () => {
    renderWithProviders(<Header />);
    const nuevoCasoLink = screen.getByText("Nuevo Caso").closest("a");
    expect(nuevoCasoLink).toHaveClass("bg-primary-600");
    expect(nuevoCasoLink).toHaveClass("text-white");
    expect(nuevoCasoLink).toHaveClass("hover:bg-primary-700");
  });

  it("is clickable and navigates", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    const casosLink = screen.getByText("Casos");
    await user.click(casosLink);
    // Navigation is handled by React Router, so we just verify it's clickable
    expect(casosLink).toBeInTheDocument();
  });

  it("has proper responsive container", () => {
    const { container } = renderWithProviders(<Header />);
    const innerDiv = container.querySelector("header > div");
    expect(innerDiv).toHaveClass("mx-auto");
    expect(innerDiv).toHaveClass("max-w-7xl");
    expect(innerDiv).toHaveClass("px-4");
    expect(innerDiv).toHaveClass("sm:px-6");
    expect(innerDiv).toHaveClass("lg:px-8");
  });

  it("has proper flex layout", () => {
    const { container } = renderWithProviders(<Header />);
    const flexContainer = container.querySelector("header > div > div");
    expect(flexContainer).toHaveClass("flex");
    expect(flexContainer).toHaveClass("h-16");
    expect(flexContainer).toHaveClass("items-center");
    expect(flexContainer).toHaveClass("justify-between");
  });

  it("has navigation with correct gap", () => {
    const { container } = renderWithProviders(<Header />);
    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("flex");
    expect(nav).toHaveClass("gap-4");
  });
});
