// src/components/Hero/HeroSection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  test('renders the hero section with title, text, and button', () => {
    render(<HeroSection />);

    // Check section
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();

    // Heading and text
    expect(screen.getByRole('heading', { name: /welcome to snapcart!/i })).toBeInTheDocument();
    expect(screen.getByText(/your one-stop shop/i)).toBeInTheDocument();

    // Button
    const button = screen.getByRole('button', { name: /shop now/i });
    expect(button).toBeInTheDocument();
  });

  test('calls console.log when "Shop Now" is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<HeroSection />);

    const button = screen.getByRole('button', { name: /shop now/i });
    fireEvent.click(button);

    expect(consoleSpy).toHaveBeenCalledWith('Shop Now button clicked');
    consoleSpy.mockRestore();
  });
});
