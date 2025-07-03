const BASE_URL = 'https://dummyjson.com';

export const getProducts = async (limit = 12, skip = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      products: data.products,
      total: data.total
    }; // Include total for pagination
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getProductsByCategory = async (category, limit = 12, skip = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      products: data.products,
      total: data.total
    };
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return { products: [], total: 0 };
  }
};
