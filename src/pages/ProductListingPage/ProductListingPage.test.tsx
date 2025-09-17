import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductListingPage from './ProductlistingPage';
import { getProducts, getCategories, getProductsByCategory } from '../../api/product';
import { Product } from '../../types';

// Mock the API functions
jest.mock('../../api/product', () => ({
  getProducts: jest.fn(),
  getCategories: jest.fn(),
  getProductsByCategory: jest.fn(),
}));

// Mock the ProductCard and ProductCardSkeleton components to avoid rendering their full logic
jest.mock('../../components/ProductCard/ProductCard', () => {
  return ({ product }: { product: Product }) => <div data-testid="product-card">{product.title}</div>;
});

jest.mock('../../components/ProductCardSkeleton/ProductCardSkeleton', () => {
  return () => <div data-testid="product-card-skeleton">Loading Skeleton</div>;
});

jest.mock('../../components/Hero/HeroSection', () => {
  return () => <div data-testid="hero-section">Hero Section</div>;
});

const mockProducts: Product[] = [
    { id: 1, title: 'iPhone 9', price: 549, category: 'smartphones' },
    { id: 2, title: 'iPhone X', price: 899, category: 'smartphones' },
    { id: 3, title: 'Samsung Universe 9', price: 1249, category: 'smartphones' },
    { id: 4, title: 'OPPOF19', price: 280, category: 'smartphones' },
    { id: 5, title: 'Huawei P30', price: 500, category: 'smartphones' }, // Corrected price to be within the range
    { id: 6, title: 'MacBook Pro', price: 1749, category: 'laptops' },
    { id: 7, title: 'Samsung Galaxy Book', price: 1499, category: 'laptops' },
    { id: 8, title: 'Microsoft Surface Laptop 4', price: 1499, category: 'laptops' },
    { id: 9, title: 'Infinix INBOOK', price: 1099, category: 'laptops' },
    { id: 10, title: 'HP Pavilion 15-DK1056wm', price: 1099, category: 'laptops' },
    { id: 11, title: 'perfume Oil', price: 13, category: 'fragrances' },
    { id: 12, title: 'Brown Perfume', price: 40, category: 'fragrances' },
    { id: 13, title: 'Fog Scent Xpressio Perfume', price: 13, category: 'fragrances' },
  ];

const mockCategories: string[] = ['smartphones', 'laptops', 'fragrances'];

describe('ProductListingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially and then display products', async () => {
    (getProducts as jest.Mock).mockResolvedValueOnce({ products: mockProducts, total: mockProducts.length });
    (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

    render(<ProductListingPage />);

    // Check for the initial loading state (skeletons)
    expect(screen.getAllByTestId('product-card-skeleton').length).toBe(8);

    // Wait for the data to load and the products to be displayed
    await waitFor(() => {
      expect(screen.queryByTestId('product-card-skeleton')).not.toBeInTheDocument();
    });

    // Check if the products from the first page are rendered
    expect(screen.getByText('iPhone 9')).toBeInTheDocument();
    expect(screen.getByText('Brown Perfume')).toBeInTheDocument();

    // Check that the HeroSection is rendered
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('should display an error message if product fetching fails', async () => {
    (getProducts as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

    // Suppress console.error output during this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('product-card-skeleton')).not.toBeInTheDocument();
    });

    expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });

  it('should filter products by search term', async () => {
    (getProducts as jest.Mock).mockResolvedValueOnce({ products: mockProducts, total: mockProducts.length });
    (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

    render(<ProductListingPage />);

    await waitFor(() => {
      expect(screen.queryByTestId('product-card-skeleton')).not.toBeInTheDocument();
    });

    // Find the search input and type "samsung"
    const searchInput = screen.getByPlaceholderText(/search products.../i);
    fireEvent.change(searchInput, { target: { value: 'samsung' } });

    // Expect only Samsung products to be visible
    await waitFor(() => {
      expect(screen.getByText('Samsung Universe 9')).toBeInTheDocument();
      expect(screen.getByText('Samsung Galaxy Book')).toBeInTheDocument();
    });
    
    // Expect other products not to be on the page
    expect(screen.queryByText('iPhone 9')).not.toBeInTheDocument();
    expect(screen.queryByText('MacBook Pro')).not.toBeInTheDocument();
  });

  it('should filter products by min and max price', async () => {
    (getProducts as jest.Mock).mockResolvedValueOnce({ products: mockProducts, total: mockProducts.length });
    (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);

    render(<ProductListingPage />);
    await waitFor(() => {
      expect(screen.queryByTestId('product-card-skeleton')).not.toBeInTheDocument();
    });

    // Find price inputs and set min/max
    const minPriceInput = screen.getByPlaceholderText(/min price/i);
    const maxPriceInput = screen.getByPlaceholderText(/max price/i);

    fireEvent.change(minPriceInput, { target: { value: '500' } });
    fireEvent.change(maxPriceInput, { target: { value: '1000' } });

    // Wait for the filtered results to appear
    await waitFor(() => {
      expect(screen.getByText('iPhone 9')).toBeInTheDocument();
      expect(screen.getByText('Huawei P30')).toBeInTheDocument();
    });

    // Check that products outside the price range are not visible
    expect(screen.queryByText('OPPOF19')).not.toBeInTheDocument();
    expect(screen.queryByText('Samsung Universe 9')).not.toBeInTheDocument();
  });

  it('should paginate correctly and update the product list', async () => {
    (getProducts as jest.Mock).mockResolvedValueOnce({ products: mockProducts, total: mockProducts.length });
    (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);
  
    render(<ProductListingPage />);
    await waitFor(() => {
      expect(screen.queryByTestId('product-card-skeleton')).not.toBeInTheDocument();
    });
  
    // Initial state: first page is visible
    expect(screen.getByText('iPhone 9')).toBeInTheDocument();
    expect(screen.queryByText('Brown Perfume')).toBeInTheDocument();
    expect(screen.queryByText('Fog Scent Xpressio Perfume')).not.toBeInTheDocument();
  
    // Click the next page button
    const nextPageButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextPageButton);
  
    // Wait for the next page of products to appear
    await waitFor(() => {
      expect(screen.getByText('Fog Scent Xpressio Perfume')).toBeInTheDocument();
    });
  
    // The previous page's products should no longer be visible
    expect(screen.queryByText('iPhone 9')).not.toBeInTheDocument();
    expect(screen.queryByText('Brown Perfume')).not.toBeInTheDocument();
  
    // Click the previous page button
    const prevPageButton = screen.getByRole('button', { name: /prev/i });
    fireEvent.click(prevPageButton);
  
    // Wait for the previous page of products to appear again
    await waitFor(() => {
      expect(screen.getByText('iPhone 9')).toBeInTheDocument();
    });
  
    // The products from the second page should no longer be visible
    expect(screen.queryByText('Fog Scent Xpressio Perfume')).not.toBeInTheDocument();
  });
  

  it('should fetch products by category when a category is selected', async () => {
    // Mock the initial calls
    (getProducts as jest.Mock).mockResolvedValueOnce({ products: mockProducts, total: mockProducts.length });
    (getCategories as jest.Mock).mockResolvedValueOnce(mockCategories);
    
    // Mock the subsequent call for 'laptops'
    const mockLaptops = mockProducts.filter(p => p.category === 'laptops');
    (getProductsByCategory as jest.Mock).mockResolvedValueOnce({ products: mockLaptops, total: mockLaptops.length });

    render(<ProductListingPage />);
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 9')).toBeInTheDocument();
    });

    // Find the category select dropdown
    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: 'laptops' } });

    // Await the new fetch call and re-render
    await waitFor(() => {
      expect(getProductsByCategory).toHaveBeenCalledWith('laptops', 1000, 0);
    });

    // Check if only laptops are now displayed
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    expect(screen.getByText('HP Pavilion 15-DK1056wm')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 9')).not.toBeInTheDocument();
  });
});