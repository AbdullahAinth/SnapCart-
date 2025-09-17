import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import { useCart } from '../../context/CartContext'; // Import the actual hook
import '@testing-library/jest-dom';

// Mock the useCart hook to control its behavior in tests
jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock the RatingStars component to simplify testing the ProductCard itself
// This prevents needing to mock react-icons within this test file
jest.mock('../RatingStars/RatingStars', () => ({ rating, count }) => (
  <div data-testid="mock-rating-stars">
    Rating: {rating} ({count})
  </div>
));

describe('ProductCard', () => {
  let mockAddToCart: jest.Mock;

  // Before each test, reset the mock and set up a default mock for useCart
  beforeEach(() => {
    mockAddToCart = jest.fn();
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart,
      cart: [], // Provide a default empty cart for tests that don't care about it
    });
  });

  // Define a base mock product that can be extended for specific test cases
  const baseMockProduct = {
    id: 1,
    title: 'Awesome Gadget',
    category: 'Electronics',
    price: 123.45,
    description: 'A fantastic gadget for all your needs.',
  };

  // Test Case 1: Renders product information correctly with number rating and primary image
  test('renders product information correctly with number rating and primary image', () => {
    const product = {
      ...baseMockProduct,
      image: 'https://example.com/gadget-main.jpg',
      rating: 4.2, // number rating
    };
    render(<ProductCard product={product} />);

    expect(screen.getByText('Awesome Gadget')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('$123.45')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Awesome Gadget' })).toHaveAttribute('src', product.image);
    expect(screen.getByText('4.2 / 5')).toBeInTheDocument();
    expect(screen.getByTestId('mock-rating-stars')).toHaveTextContent('Rating: 4.2 (0)'); // rating count should be 0 for number rating
  });

  // Test Case 2: Renders product information correctly with object rating and images array
  test('renders product information correctly with object rating and images array', () => {
    const product = {
      ...baseMockProduct,
      images: ['https://example.com/gadget-img1.jpg', 'https://example.com/gadget-img2.jpg'],
      rating: { rate: 3.8, count: 150 }, // object rating
    };
    render(<ProductCard product={product} />);

    expect(screen.getByText('Awesome Gadget')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Awesome Gadget' })).toHaveAttribute('src', product.images[0]); // Should use the first image from images array
    expect(screen.getByText('3.8 / 5')).toBeInTheDocument();
    expect(screen.getByTestId('mock-rating-stars')).toHaveTextContent('Rating: 3.8 (150)');
  });

  // Test Case 3: Renders product information correctly with thumbnail if other image properties are missing
  test('renders thumbnail if primary image and images array are missing', () => {
    const product = {
      ...baseMockProduct,
      thumbnail: 'https://example.com/gadget-thumb.jpg',
      // No 'image' or 'images'
    };
    render(<ProductCard product={product} />);

    expect(screen.getByRole('img', { name: 'Awesome Gadget' })).toHaveAttribute('src', product.thumbnail);
  });

  // Test Case 4: Renders empty src for image if no image source is provided
  test('renders empty string for image src if no image source is provided', () => {
    const product = {
      ...baseMockProduct,
      // No 'image', 'images', or 'thumbnail'
    };
    render(<ProductCard product={product} />);

    expect(screen.getByRole('img', { name: 'Awesome Gadget' })).toHaveAttribute('src', '');
  });

  // Test Case 5: Calls addToCart with correctly formatted product when button is clicked
  test('calls addToCart with correctly formatted product when button is clicked', () => {
    const productWithNumberId = {
      ...baseMockProduct,
      id: 99, // Simulate a number ID
      title: 'Amazing Widget',
      name: 'Widget Product Name', // Simulate product having a 'name' property
      image: 'image.jpg',
      rating: 4,
    };
    render(<ProductCard product={productWithNumberId} />);

    const addButton = screen.getByRole('button', { name: `Add ${productWithNumberId.title} to cart` });
    fireEvent.click(addButton);

    // Assert that addToCart was called once
    expect(mockAddToCart).toHaveBeenCalledTimes(1);

    // Assert that addToCart was called with the transformed product object
    expect(mockAddToCart).toHaveBeenCalledWith({
      ...productWithNumberId,
      id: '99', // Ensure id is converted to string
      name: 'Widget Product Name', // Ensure name is passed if present
    });
  });

  // Test Case 6: Calls addToCart with title as name if product.name is missing
  test('calls addToCart with title as name if product.name is missing', () => {
    const productWithoutName = {
      ...baseMockProduct,
      id: 100,
      title: 'Product Without Name',
      image: 'image.jpg',
      rating: 3,
      // No 'name' property
    };
    render(<ProductCard product={productWithoutName} />);

    const addButton = screen.getByRole('button', { name: `Add ${productWithoutName.title} to cart` });
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith({
      ...productWithoutName,
      id: '100',
      name: 'Product Without Name', // 'title' should be used as 'name'
    });
  });
});