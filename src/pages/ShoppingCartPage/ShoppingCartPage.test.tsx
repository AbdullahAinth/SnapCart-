// src/pages/ShoppingCartPage/ShoppingCartPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ShoppingCartPage from './ShoppingCartPage';

// Mock the react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useCart hook
const mockUseCart = useCart as jest.Mock;
jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock window.alert
const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('ShoppingCartPage', () => {
  const mockCartItems = [
    { id: 1, title: 'Test Product 1', price: 10, quantity: 2, images: ['test-image-1.jpg'] },
    { id: 2, title: 'Test Product 2', price: 25, quantity: 1, images: ['test-image-2.jpg'] },
  ];

  const setup = (cartItems: any[]) => {
    mockUseCart.mockReturnValue({
      cartItems,
      removeFromCart: jest.fn(),
      updateQuantity: jest.fn(),
      getCartTotalPrice: () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    });
    render(<ShoppingCartPage />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the empty cart message when the cart is empty', () => {
    setup([]);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Start adding items to see them here.')).toBeInTheDocument();
  });

  it('should render cart items when the cart is not empty', () => {
    setup(mockCartItems);
    expect(screen.getByText('Your Shopping Cart')).toBeInTheDocument();
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: $20.00')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: $25.00')).toBeInTheDocument();
  });

  it('should call updateQuantity with a new value when input quantity changes', () => {
    const mockUpdateQuantity = jest.fn();
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      getCartTotalPrice: () => 45,
    });
    render(<ShoppingCartPage />);

    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: '3' } });

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('should not call updateQuantity when an invalid input quantity is entered', () => {
    const mockUpdateQuantity = jest.fn();
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      getCartTotalPrice: () => 45,
    });
    render(<ShoppingCartPage />);

    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: 'abc' } });

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });
  
  it('should not call updateQuantity when a quantity of 0 is entered', () => {
    const mockUpdateQuantity = jest.fn();
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      getCartTotalPrice: () => 45,
    });
    render(<ShoppingCartPage />);

    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: '0' } });

    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });


  it('should call updateQuantity with a new value when the + button is clicked', () => {
    const mockUpdateQuantity = jest.fn();
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      getCartTotalPrice: () => 45,
    });
    render(<ShoppingCartPage />);
    
    // Find the "+" button for the first item
    const plusButton = screen.getAllByRole('button', { name: '+' })[0];
    fireEvent.click(plusButton);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });
  
  it('should call updateQuantity with a new value when the - button is clicked', () => {
    const mockUpdateQuantity = jest.fn();
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      removeFromCart: jest.fn(),
      updateQuantity: mockUpdateQuantity,
      getCartTotalPrice: () => 45,
    });
    render(<ShoppingCartPage />);
    
    // Find the "-" button for the first item
    const minusButton = screen.getAllByRole('button', { name: '−' })[0];
    fireEvent.click(minusButton);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('should call removeFromCart when the remove button is clicked', () => {
    const mockRemoveFromCart = jest.fn();
    mockUseCart.mockReturnValue({
      cartItems: mockCartItems,
      removeFromCart: mockRemoveFromCart,
      updateQuantity: jest.fn(),
      getCartTotalPrice: () => 45,
    });
    render(<ShoppingCartPage />);

    const removeButton = screen.getAllByRole('button', { name: /remove/i })[0];
    fireEvent.click(removeButton);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  it('should navigate to checkout when proceed to checkout is clicked with items in cart', () => {
    setup(mockCartItems);

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    fireEvent.click(checkoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    expect(mockAlert).not.toHaveBeenCalled();
  });

  it('should show an alert and not navigate when proceed to checkout is clicked with an empty cart', () => {
    setup([]);

    const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
    fireEvent.click(checkoutButton);
    
    expect(mockAlert).toHaveBeenCalledWith('Your cart is empty. Please add items before proceeding to checkout.');
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});