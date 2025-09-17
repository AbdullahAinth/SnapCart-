// src/context/ProductContext.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { ProductContext, ProductProvider } from './ProductContext';
import { ReactNode, useContext } from 'react';

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

const mockProducts = [
  { id: 1, title: 'Product 1', price: 100 },
  { id: 2, title: 'Product 2', price: 200 },
];

describe('ProductProvider', () => {
  // A helper function to wrap the component in the provider
  const wrapper = ({ children }: { children: ReactNode }) => (
    <ProductProvider>{children}</ProductProvider>
  );

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test Case 1: Initial state and loading
  it('should have an initial state of loading', () => {
    // Mock the fetch call to never resolve so we can test the initial 'loading' state.
    // We are deliberately not waiting for the fetch to complete here.
    mockFetch.mockReturnValue(new Promise(() => {}));
    
    const { result } = renderHook(() => useContext(ProductContext), { wrapper });
    
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  // Test Case 2: Successful product fetch (Covers the successful branch)
  it('should fetch products successfully and update the state', async () => {
    // Mock a successful fetch response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ products: mockProducts }),
    });

    const { result } = renderHook(() => useContext(ProductContext), { wrapper });
    
    // The initial loading state is true
    expect(result.current.loading).toBe(true);
    
    // Use waitFor to wait for the state update caused by the async operation
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.error).toBeNull();
    });

    expect(mockFetch).toHaveBeenCalledWith("https://dummyjson.com/products");
  });

  // Test Case 3: Handle API error (Covers the `if (!res.ok)` branch)
  it('should handle API errors and update the error state', async () => {
    // Mock a fetch response with a non-ok status
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });
    
    const { result } = renderHook(() => useContext(ProductContext), { wrapper });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Failed to fetch products");
      expect(result.current.products).toEqual([]);
    });
  });

  // Test Case 4: Handle network error (Covers the `catch (err)` block)
  it('should handle network errors and update the error state', async () => {
    const errorMessage = "Network request failed";
    // Mock a rejected fetch promise to simulate a network error
    mockFetch.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useContext(ProductContext), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.products).toEqual([]);
    });
  });

  // Test Case 5: Handle a successful fetch with no products (Covers the `data.products || []` branch)
  it('should handle a successful fetch with an empty products array', async () => {
    // Mock a successful response with an empty or missing `products` key
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useContext(ProductContext), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });
});