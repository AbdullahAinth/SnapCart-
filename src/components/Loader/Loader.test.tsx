// src/components/Loader/Loader.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader component', () => {
  test('renders with default props', () => {
    render(<Loader />);
    const loaderElement = screen.getByRole('status', { name: /loading/i });
    expect(loaderElement).toBeInTheDocument();
    expect(loaderElement).toHaveClass('loaderContainer');
  });

  test('applies fullScreen class when fullScreen is true', () => {
    render(<Loader fullScreen />);
    const loaderElement = screen.getByRole('status', { name: /loading/i });
    expect(loaderElement.className).toMatch(/fullScreen/);
  });

  test('applies custom size to the spinner', () => {
    const customSize = 80;
    render(<Loader size={customSize} />);
    const spinnerElement = screen.getByRole('status', { name: /loading/i }).firstChild as HTMLElement;
    expect(spinnerElement).toHaveStyle(`width: ${customSize}px`);
    expect(spinnerElement).toHaveStyle(`height: ${customSize}px`);
  });
});
