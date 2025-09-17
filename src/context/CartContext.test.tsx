// src/context/CartContext.test.tsx
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import { Product } from "../types";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <CartProvider>{children}</CartProvider>
);

const sampleProduct: Product = { id: 1, title: "Test Product", price: 100 };

describe("CartContext", () => {
  it("throws error if useCart is used outside provider", () => {
    const { result } = renderHook(() => {
      try {
        return useCart();
      } catch (err: any) {
        return err.message;
      }
    });
    expect(result.current).toBe("useCart must be used within a CartProvider");
  });

  it("adds a product to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct);
    });
    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(1);
  });

  it("increments quantity if same product added again", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.addToCart(sampleProduct);
    });
    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  it("updates product quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.updateQuantity(sampleProduct.id, 5);
    });
    expect(result.current.cartItems[0].quantity).toBe(5);
  });

  it("removes product when quantity set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.updateQuantity(sampleProduct.id, 0);
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  it("removes product from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.removeFromCart(sampleProduct.id);
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  it("clears the entire cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct);
      result.current.clearCart();
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  it("calculates total price correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(sampleProduct); // qty 1
      result.current.addToCart({ id: 2, title: "Another", price: 50 }); // qty 1
      result.current.updateQuantity(2, 3); // qty 3
    });
    expect(result.current.getCartTotalPrice()).toBe(100 * 1 + 50 * 3);
  });
});
