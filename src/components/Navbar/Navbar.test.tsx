// src/components/Navbar/Navbar.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

// Mock the CSS module to avoid CSS parsing errors
jest.mock('./Navbar.module.css', () => ({
  navbar: 'navbar',
  logo: 'logo',
  hamburger: 'hamburger',
  navLinks: 'navLinks',
  active: 'active',
  cartLink: 'cartLink',
  cartBadge: 'cartBadge',
  themeToggle: 'themeToggle',
}));

// Mock the custom hooks
jest.mock('../../context/ThemeContext', () => ({
  useTheme: jest.fn(),
}));
jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

// Mock the react-icons to prevent rendering issues in tests
jest.mock('react-icons/fa', () => ({
  FaBars: () => <div data-testid="fa-bars">Bars</div>,
  FaTimes: () => <div data-testid="fa-times">Times</div>,
  FaShoppingCart: () => <div data-testid="fa-shopping-cart">Cart</div>,
}));

describe('Navbar', () => {
  // Set up mock return values for the hooks before each test
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
    });
    (useCart as jest.Mock).mockReturnValue({
      cartItems: [],
    });
  });

  it('should render without crashing', () => {
    // We wrap the component in MemoryRouter because it uses Link components
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('SnapCart')).toBeInTheDocument();
  });

  it('should display the correct navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Orders')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
  });

  it('should toggle the mobile menu when the hamburger icon is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const hamburgerIcon = screen.getByTestId('fa-bars');
    const navLinks = screen.getByRole('list');

    // Menu should not be active initially
    expect(navLinks).not.toHaveClass('active');

    fireEvent.click(hamburgerIcon);

    // Menu should be active after click
    expect(navLinks).toHaveClass('active');
  });

  it('should close the mobile menu when a link is clicked', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const hamburgerIcon = screen.getByTestId('fa-bars');
    const homeLink = screen.getByText('Home');
    const navLinks = screen.getByRole('list');

    // Open the menu first
    fireEvent.click(hamburgerIcon);
    expect(navLinks).toHaveClass('active');
    
    // Click a link to close the menu
    fireEvent.click(homeLink);

    // Menu should be closed
    expect(navLinks).not.toHaveClass('active');
  });

  it('should display cart badge with total quantity when cart is not empty', () => {
    // Mock the useCart hook to return items with a total quantity of 5
    (useCart as jest.Mock).mockReturnValue({
      cartItems: [{ id: '1', quantity: 2, price: 10, name: 'Product A' }, { id: '2', quantity: 3, price: 20, name: 'Product B' }],
    });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const cartBadge = screen.getByText('5');
    expect(cartBadge).toBeInTheDocument();
  });
  
  it('should not display cart badge when cart is empty', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const cartBadge = screen.queryByText(/\d/);
    expect(cartBadge).toBeNull();
  });

  it('should call toggleTheme when the theme toggle button is clicked', () => {
    const mockToggleTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const themeToggleButton = screen.getByText('☀️ Light');
    fireEvent.click(themeToggleButton);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});