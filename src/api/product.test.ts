// src/api/product.test.ts
import { getProducts, getProductById, getCategories, getProductsByCategory } from "./product";
import { ProductResponse, Product } from "../types";

// Mock fetch globally
const mockFetch = global.fetch = jest.fn();

describe("product API functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("returns products on success", async () => {
      const mockData: ProductResponse = { products: [{ id: 1, title: "Test" } as Product], total: 1, skip: 0, limit: 12 };
      (mockFetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getProducts(12, 0);
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith("https://dummyjson.com/products?limit=12&skip=0");
    });

    it("returns fallback on error", async () => {
      (mockFetch as jest.Mock).mockRejectedValueOnce(new Error("network error"));

      const result = await getProducts();
      expect(result).toEqual({ products: [], total: 0, skip: 0, limit: 0 });
    });

    it("returns fallback on non-ok response", async () => {
      (mockFetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await getProducts();
      expect(result).toEqual({ products: [], total: 0, skip: 0, limit: 0 });
    });
  });

  describe("getProductById", () => {
    it("returns product on success", async () => {
      const mockProduct = { id: 1, title: "Phone" };
      (mockFetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProduct,
      });

      const result = await getProductById(1);
      expect(result).toEqual(mockProduct);
      expect(mockFetch).toHaveBeenCalledWith("https://dummyjson.com/products/1");
    });

    it("returns null on error", async () => {
      (mockFetch as jest.Mock).mockRejectedValueOnce(new Error("network error"));

      const result = await getProductById(1);
      expect(result).toBeNull();
    });

    it("returns null on non-ok response", async () => {
      (mockFetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 404 });

      const result = await getProductById(999);
      expect(result).toBeNull();
    });
  });

  describe("getCategories", () => {
    it("returns categories on success", async () => {
      const mockCategories = ["phones", "laptops"];
      (mockFetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      const result = await getCategories();
      expect(result).toEqual(mockCategories);
      expect(mockFetch).toHaveBeenCalledWith("https://dummyjson.com/products/categories");
    });

    it("returns empty array on error", async () => {
      (mockFetch as jest.Mock).mockRejectedValueOnce(new Error("network error"));

      const result = await getCategories();
      expect(result).toEqual([]);
    });

    it("returns empty array on non-ok response", async () => {
      (mockFetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await getCategories();
      expect(result).toEqual([]);
    });
  });

  describe("getProductsByCategory", () => {
    it("returns products on success", async () => {
      const mockData: ProductResponse = { products: [{ id: 2, title: "Laptop" } as Product], total: 1, skip: 0, limit: 12 };
      (mockFetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await getProductsByCategory("laptops", 12, 0);
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith("https://dummyjson.com/products/category/laptops?limit=12&skip=0");
    });

    it("returns fallback on error", async () => {
      (mockFetch as jest.Mock).mockRejectedValueOnce(new Error("network error"));

      const result = await getProductsByCategory("laptops");
      expect(result).toEqual({ products: [], total: 0, skip: 0, limit: 0 });
    });

    it("returns fallback on non-ok response", async () => {
      (mockFetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await getProductsByCategory("laptops");
      expect(result).toEqual({ products: [], total: 0, skip: 0, limit: 0 });
    });
  });
});
