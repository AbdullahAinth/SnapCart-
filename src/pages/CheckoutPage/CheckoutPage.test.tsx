import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

// Mock the react-router-dom and react-hot-toast dependencies
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock the CartContext
jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

const mockCartItems = [
  { id: 1, title: 'Item 1', price: 10.00, quantity: 2 },
  { id: 2, title: 'Item 2', price: 20.00, quantity: 1 },
];

const mockUseCart = (items = mockCartItems, total = 40) => ({
  cartItems: items,
  getCartTotalPrice: () => total,
  clearCart: jest.fn(),
});

describe('CheckoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (cartMock = mockUseCart()) => {
    (useCart as jest.Mock).mockReturnValue(cartMock);
    return render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>
    );
  };

  it('renders the checkout page with order summary', () => {
    renderWithRouter();
    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument();
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/item 1 \(x2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/item 2 \(x1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/\$40\.00/i)).toBeInTheDocument();
  });

  it('renders a message when the cart is empty', () => {
    renderWithRouter(mockUseCart([], 0));
    expect(screen.getByText(/your cart is empty\./i)).toBeInTheDocument();
  });

  it('displays an error and navigates to home when submitting an empty cart', async () => {
    renderWithRouter(mockUseCart([], 0));
    fireEvent.submit(screen.getByRole('button', { name: /place order/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Your cart is empty. Please add items before checking out.');
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays an error when required shipping information is missing', async () => {
    renderWithRouter();

    // Submit with empty fields
    await userEvent.click(screen.getByRole('button', { name: /place order/i }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fill out all required fields.');
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('displays an error when required credit card details are missing', async () => {
    renderWithRouter();

    // Fill in shipping info but leave card details empty
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    await userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    await userEvent.click(screen.getByRole('button', { name: /place order/i }));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter all credit card details.');
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('successfully places an order with credit card details', async () => {
    const mockClearCart = jest.fn();
    renderWithRouter({ ...mockUseCart(), clearCart: mockClearCart });

    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    await userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText(/card number/i), '1111222233334444');
    await userEvent.type(screen.getByLabelText(/expiry date/i), '12/25');
    await userEvent.type(screen.getByLabelText(/cvv/i), '123');
    
    // Mock console.log to check output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await userEvent.click(screen.getByRole('button', { name: /place order/i }));
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Order placed successfully!');
    });
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(consoleSpy).toHaveBeenCalledWith("Order Placed:", expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('successfully places an order with PayPal details', async () => {
    const mockClearCart = jest.fn();
    renderWithRouter({ ...mockUseCart(), clearCart: mockClearCart });

    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    await userEvent.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    
    // Change to PayPal payment method
    await userEvent.selectOptions(screen.getByLabelText(/payment method/i), 'paypal');

    // Make sure credit card fields are not visible
    expect(screen.queryByLabelText(/card number/i)).not.toBeInTheDocument();

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await userEvent.click(screen.getByRole('button', { name: /place order/i }));
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Order placed successfully!');
    });
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(consoleSpy).toHaveBeenCalledWith("Order Placed:", expect.any(Object));
    consoleSpy.mockRestore();
  });
});