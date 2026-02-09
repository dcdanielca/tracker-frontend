import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CaseForm } from "../CaseForm";
import { renderWithProviders } from "@/test/utils";

// Mock useCreateCase hook
vi.mock("../../hooks/useCreateCase", () => ({
  useCreateCase: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Mock window.history.back
const mockHistoryBack = vi.fn();
Object.defineProperty(window, "history", {
  value: { back: mockHistoryBack },
  writable: true,
});

describe("CaseForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    renderWithProviders(<CaseForm />);

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo de caso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prioridad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/creado por/i)).toBeInTheDocument();
  });

  it("renders initial query field", () => {
    renderWithProviders(<CaseForm />);

    expect(screen.getByText("Query 1")).toBeInTheDocument();
    expect(screen.getByLabelText(/base de datos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/schema/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/query sql/i)).toBeInTheDocument();
  });

  it("renders submit and cancel buttons", () => {
    renderWithProviders(<CaseForm />);

    expect(
      screen.getByRole("button", { name: /crear caso/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancelar/i })
    ).toBeInTheDocument();
  });

  it("adds new query field when clicking add button", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const addButton = screen.getByRole("button", { name: /agregar query/i });
    await user.click(addButton);

    expect(screen.getByText("Query 1")).toBeInTheDocument();
    expect(screen.getByText("Query 2")).toBeInTheDocument();
  });

  it("removes query field when clicking remove button", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    // Add second query
    const addButton = screen.getByRole("button", { name: /agregar query/i });
    await user.click(addButton);

    expect(screen.getByText("Query 2")).toBeInTheDocument();

    // Remove second query
    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(removeButtons[1]);

    expect(screen.queryByText("Query 2")).not.toBeInTheDocument();
  });

  it("does not show remove button when only one query", () => {
    renderWithProviders(<CaseForm />);

    expect(
      screen.queryByRole("button", { name: /eliminar/i })
    ).not.toBeInTheDocument();
  });

  it("disables add query button when 10 queries reached", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const addButton = screen.getByRole("button", { name: /agregar query/i });

    // Add 9 more queries (already have 1)
    for (let i = 0; i < 9; i++) {
      await user.click(addButton);
    }

    expect(addButton).toBeDisabled();
  });

  it("shows validation error for empty title", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /crear caso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/el título debe tener al menos 5 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for short title", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/título/i);
    await user.type(titleInput, "abc");

    const submitButton = screen.getByRole("button", { name: /crear caso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/el título debe tener al menos 5 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty description", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/título/i);
    await user.type(titleInput, "Valid Title");

    const submitButton = screen.getByRole("button", { name: /crear caso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/la descripción debe tener al menos 10 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty created_by", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);

    await user.type(titleInput, "Valid Title");
    await user.type(descriptionInput, "Valid description text");

    const submitButton = screen.getByRole("button", { name: /crear caso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/el nombre debe tener al menos 3 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty case type", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const createdByInput = screen.getByLabelText(/creado por/i);

    await user.type(titleInput, "Valid Title");
    await user.type(descriptionInput, "Valid description text");
    await user.type(createdByInput, "John Doe");

    const submitButton = screen.getByRole("button", { name: /crear caso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/selecciona un tipo de caso válido/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty priority", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const createdByInput = screen.getByLabelText(/creado por/i);
    const caseTypeSelect = screen.getByLabelText(/tipo de caso/i);

    await user.type(titleInput, "Valid Title");
    await user.type(descriptionInput, "Valid description text");
    await user.type(createdByInput, "John Doe");
    await user.selectOptions(caseTypeSelect, "support");

    const submitButton = screen.getByRole("button", { name: /crear caso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/selecciona una prioridad válida/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for empty query fields", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const titleInput = screen.getByLabelText(/título/i);
    const descriptionInput = screen.getByLabelText(/descripción/i);
    const createdByInput = screen.getByLabelText(/creado por/i);
    const caseTypeSelect = screen.getByLabelText(/tipo de caso/i);
    const prioritySelect = screen.getByLabelText(/prioridad/i);

    await user.type(titleInput, "Valid Title");
    await user.type(descriptionInput, "Valid description text");
    await user.type(createdByInput, "John Doe");
    await user.selectOptions(caseTypeSelect, "support");
    await user.selectOptions(prioritySelect, "high");

    const submitButton = screen.getByRole("button", { name: /crear caso/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/el nombre de la base de datos es requerido/i)
      ).toBeInTheDocument();
    });
  });

  it("calls history.back when cancel button clicked", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockHistoryBack).toHaveBeenCalledTimes(1);
  });

  it("displays case type options", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const caseTypeSelect = screen.getByLabelText(/tipo de caso/i);
    await user.click(caseTypeSelect);

    expect(screen.getByRole("option", { name: /soporte/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /requerimiento/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /investigación/i })
    ).toBeInTheDocument();
  });

  it("displays priority options", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    const prioritySelect = screen.getByLabelText(/prioridad/i);
    await user.click(prioritySelect);

    expect(screen.getByRole("option", { name: /baja/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /media/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /alta/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /crítica/i })
    ).toBeInTheDocument();
  });

  it("maintains query numbering when removing middle query", async () => {
    renderWithProviders(<CaseForm />);
    const user = userEvent.setup();

    // Add 3 queries
    const addButton = screen.getByRole("button", { name: /agregar query/i });
    await user.click(addButton);
    await user.click(addButton);

    expect(screen.getByText("Query 1")).toBeInTheDocument();
    expect(screen.getByText("Query 2")).toBeInTheDocument();
    expect(screen.getByText("Query 3")).toBeInTheDocument();

    // Remove middle query
    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    await user.click(removeButtons[1]);

    // Should still show Query 1 and Query 2 (renumbered)
    expect(screen.getByText("Query 1")).toBeInTheDocument();
    expect(screen.getByText("Query 2")).toBeInTheDocument();
    expect(screen.queryByText("Query 3")).not.toBeInTheDocument();
  });
});
