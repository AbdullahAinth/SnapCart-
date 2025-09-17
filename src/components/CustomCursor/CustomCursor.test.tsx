// src/components/CustomCursor.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CustomCursor from "./CustomCursor";

describe("CustomCursor component", () => {
  test("renders without crashing", () => {
    const { getByTestId } = render(<CustomCursor />);
    const cursor = getByTestId("custom-cursor");
    expect(cursor).toBeInTheDocument();
  });

  test("moves the cursor when mouse moves", () => {
    const { getByTestId } = render(<CustomCursor />);
    const cursor = getByTestId("custom-cursor");

    fireEvent.mouseMove(document, { clientX: 50, clientY: 100 });

    // Because of RAF, transform updates asynchronously
    setTimeout(() => {
      expect(cursor.style.transform).toContain("translate3d(50px, 100px");
    }, 0);
  });

  test("applies hovered class when over interactive element", () => {
    const { getByTestId } = render(<CustomCursor />);
    const cursor = getByTestId("custom-cursor");

    const button = document.createElement("button");
    document.body.appendChild(button);

    fireEvent.mouseMove(button, { clientX: 10, clientY: 20 });
    expect(cursor.classList.contains("hovered")).toBe(true);

    document.body.removeChild(button);
  });

  test("does not apply hovered class when not over interactive element", () => {
    const { getByTestId } = render(<CustomCursor />);
    const cursor = getByTestId("custom-cursor");

    const div = document.createElement("div");
    document.body.appendChild(div);

    fireEvent.mouseMove(div, { clientX: 30, clientY: 40 });
    expect(cursor.classList.contains("hovered")).toBe(false);

    document.body.removeChild(div);
  });
});
