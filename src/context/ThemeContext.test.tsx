// src/context/ThemeContext.test.tsx
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

describe("ThemeContext", () => {
  let originalMatchMedia: any;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    originalMatchMedia = window.matchMedia;
    (window.matchMedia as any) = jest.fn().mockReturnValue({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    });
    jest.spyOn(Storage.prototype, "getItem");
    jest.spyOn(Storage.prototype, "setItem");
    document.body.setAttribute("data-theme", "");
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("throws error if useTheme is used outside provider", () => {
    const { result } = renderHook(() => {
      try {
        return useTheme();
      } catch (e) {
        return e;
      }
    });
    expect(result.current).toEqual(
      new Error("useTheme must be used within a ThemeProvider")
    );
  });

  it("initializes theme from localStorage (dark)", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue("dark");
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe("dark");
  });

  it("initializes theme from localStorage (light)", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue("light");
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe("light");
  });

  it("falls back to matchMedia when localStorage is empty", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    (window.matchMedia as any).mockReturnValueOnce({ matches: true });
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe("dark");
  });

  it("handles localStorage get errors gracefully", () => {
    (localStorage.getItem as jest.Mock).mockImplementation(() => {
      throw new Error("get error");
    });
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.theme).toBe("light");
  });

  it("toggles theme from light to dark and back", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue("light");
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe("light");
  });

  it("updates localStorage and document body on theme change", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue("light");
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    expect(document.body.getAttribute("data-theme")).toBe("dark");
  });
});
