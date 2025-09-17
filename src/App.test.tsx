// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App component', () => {
  test('renders the navbar', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const navbarElement = screen.getByRole('navigation');
    expect(navbarElement).toBeInTheDocument();
  });

  test('renders ProductListingPage on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const productPageHeader = screen.getByText(/Products/i);
    expect(productPageHeader).toBeInTheDocument();
  });

  test('renders ShoppingCartPage on /cart route', () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <App />
      </MemoryRouter>
    );
    const cartPageHeader = screen.getByText(/Shopping Cart/i);
    expect(cartPageHeader).toBeInTheDocument();
  });

  test('renders ProductListingPage on unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <App />
      </MemoryRouter>
    );
    const productPageHeader = screen.getByText(/Products/i);
    expect(productPageHeader).toBeInTheDocument();
  });
});
