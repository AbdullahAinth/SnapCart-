import React from 'react';
import { render, screen } from '@testing-library/react';
import MyOrdersPage from './MyOrdersPage';

describe('MyOrdersPage', () => {
  it('should render the page title, introductory text, and disclaimer', () => {
    render(<MyOrdersPage />);
    
    // Check for the main heading
    expect(screen.getByRole('heading', { name: /my orders/i })).toBeInTheDocument();
    
    // Check for the introductory paragraph
    expect(screen.getByText(/this is where your order history would be displayed./i)).toBeInTheDocument();
    
    // Check for the disclaimer note
    expect(screen.getByText(/note:/i)).toBeInTheDocument();
    expect(screen.getByText(/this is mock data. real orders will appear here once implemented./i)).toBeInTheDocument();
  });

  it('should render all mock orders with correct details', () => {
    render(<MyOrdersPage />);
    
    // Check for the presence of both mock order IDs
    expect(screen.getByText(/order #12345/i)).toBeInTheDocument();
    expect(screen.getByText(/order #12346/i)).toBeInTheDocument();

    // Check details for the first order
    const order1 = screen.getByText(/order #12345/i).closest('div');
    expect(order1).toHaveTextContent('Date: July 1, 2025');
    expect(order1).toHaveTextContent('Total: $150.00');
    expect(order1).toHaveTextContent('Product A (x1)');
    expect(order1).toHaveTextContent('Product B (x2)');

    // Check details for the second order
    const order2 = screen.getByText(/order #12346/i).closest('div');
    expect(order2).toHaveTextContent('Date: June 15, 2025');
    expect(order2).toHaveTextContent('Total: $75.50');
    expect(order2).toHaveTextContent('Product C (x1)');
    
    // Check that there are exactly two order cards rendered
    const orderCards = screen.getAllByText(/order #/i);
    expect(orderCards).toHaveLength(2);
  });
});