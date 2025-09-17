import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams } from 'react-router-dom';
import ProductDetailPage from './ProductDetailPage';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';

// Mocking external dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock the global fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('ProductDetailPage', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'This is a test product.',
    price: 9.99,
    category: 'electronics',
    rating: { rate: 4.5, count: 10 },
    image: 'test-image.jpg',
  };

  const mockUseParams = useParams as jest.Mock;
  const mockUseCart = useCart as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCart.mockReturnValue({ addToCart: jest.fn() });
  });

  // Test Case 1: Renders loading state initially
  it('should render loading state initially', () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetch.mockReturnValue(new Promise(() => {})); // Mock an indefinitely pending promise

    render(<ProductDetailPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Test Case 2: Renders product details on a successful fetch
  it('should render product details on a successful fetch', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Test Product' })).toBeInTheDocument();
      expect(screen.getByText('This is a test product.')).toBeInTheDocument();
      expect(screen.getByText('$9.99')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: 'Test Product' })).toHaveAttribute('src', 'test-image.jpg');
    });
  });

  // Test Case 3: Renders "Product not found" if the fetch returns null/empty
  // Note: The provided component doesn't explicitly check for a null product, but a 404 response is more common.
  it('should render "Product not found" on a 404 response', async () => {
    mockUseParams.mockReturnValue({ id: '999' });
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(null),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeInTheDocument();
    });
  });

  // Test Case 4: Renders error message on API failure
  it('should render an error message on API failure', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({}),
    });

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load product details')).toBeInTheDocument();
    });
  });

  // Test Case 5: Renders error on fetch error (e.g., network error)
  it('should render an error on a network error', async () => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<ProductDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load product details')).toBeInTheDocument();
    });
  });

  // Test Case 6: Should call addToCart when the add to cart button is clicked
  it('should call addToCart when the add to cart button is clicked', async () => {
    const mockAddToCart = jest.fn();
    mockUseCart.mockReturnValue({ addToCart: mockAddToCart });
    mockUseParams.mockReturnValue({ id: '1' });
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    });

    render(<ProductDetailPage />);

    // Wait for the product details to load and the button to appear
    await screen.findByRole('button', { name: /add to cart/i });
    
    // Simulate a user click on the button
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    userEvent.click(addToCartButton);

    // Assert that addToCart was called with the correct product
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });
});