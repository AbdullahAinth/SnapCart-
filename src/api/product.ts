import { Product, ProductResponse } from "../types";

const BASE_URL = 'https://dummyjson.com';

export const getProducts = async (limit = 12, skip = 0): Promise<ProductResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fix: Add missing skip and limit properties to the error return object.
    return { products: [], total: 0, skip: 0, limit: 0 };
  }
};

export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getProductsByCategory = async (
  category: string,
  limit = 12,
  skip = 0
): Promise<ProductResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    // Fix: Add missing skip and limit properties to the error return object.
    return { products: [], total: 0, skip: 0, limit: 0 };
  }
};