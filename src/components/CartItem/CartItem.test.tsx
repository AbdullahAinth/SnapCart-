// Test file: src/components/CartItem/CartItem.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from './CartItem';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { CartItem as CartItemType } from '../../types';
import userEvent from '@testing-library/user-event';

// Mock the useCart hook
jest.mock('../../context/CartContext');
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

describe('CartItem', () => {
  const mockProduct = {
    id: 201,
    title: 'Fancy T-Shirt',
    price: 25.50,
    image: 'tshirt-image.jpg',
  } as Product;

  const mockCartItem = {
    ...mockProduct,
    id: '201',
    quantity: 3,
  } as CartItemType;

  it('should render cart item details correctly', () => {
    mockUseCart.mockReturnValue({
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      getCartTotalPrice: jest.fn(),
      cartItems: [mockCartItem],
      clearCart: jest.fn(),
    });

    render(<CartItem item={mockCartItem} />);

    expect(screen.getByText('Fancy T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('$25.50')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Fancy T-Shirt' })).toHaveAttribute('src', 'tshirt-image.jpg');
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByText('$76.50')).toBeInTheDocument(); // 25.50 * 3
  });

  it('should call updateQuantity when the quantity input is changed', () => {
    const mockUpdateQuantity = jest.fn();
    mockUseCart.mockReturnValue({
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      getCartTotalPrice: jest.fn(),
      cartItems: [mockCartItem],
      clearCart: jest.fn(),
    });

    render(<CartItem item={mockCartItem} />);

    const quantityInput = screen.getByDisplayValue('3');
    userEvent.clear(quantityInput);
    userEvent.type(quantityInput, '5');

    // Expect the update to be called with the new value
    expect(mockUpdateQuantity).toHaveBeenCalledWith('201', 5);
  });

  it('should not call updateQuantity with a non-positive value', () => {
    const mockUpdateQuantity = jest.fn();
    mockUseCart.mockReturnValue({
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      getCartTotalPrice: jest.fn(),
      cartItems: [mockCartItem],
      clearCart: jest.fn(),
    });

    render(<CartItem item={mockCartItem} />);

    const quantityInput = screen.getByDisplayValue('3');
    userEvent.clear(quantityInput);
    userEvent.type(quantityInput, '0');

    // Expect the update not to be called, or at least not with '0'
    // The component logic should handle this, but the test ensures the handler is not triggered incorrectly
    expect(mockUpdateQuantity).not.toHaveBeenCalledWith('201', 0);
  });

  it('should call removeFromCart when the remove button is clicked', () => {
    const mockRemoveFromCart = jest.fn();
    mockUseCart.mockReturnValue({
      addToCart: jest.fn(),
      removeFromCart: mockRemoveFromCart,
      updateQuantity: jest.fn(),
      getCartTotalPrice: jest.fn(),
      cartItems: [mockCartItem],
      clearCart: jest.fn(),
    });

    render(<CartItem item={mockCartItem} />);

    const removeButton = screen.getByRole('button', { name: /remove/i });
    userEvent.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('201');
  });
});