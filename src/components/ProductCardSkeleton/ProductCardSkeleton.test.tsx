import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCardSkeleton from './ProductCardSkeleton';

// Mock the CSS module
// This is typically done globally in your Jest config, but can be done per file as well
jest.mock('./ProductCardSkeleton.module.css', () => ({
  skeletonCard: 'skeletonCard',
  skeletonImage: 'skeletonImage',
  skeletonTitle: 'skeletonTitle',
  skeletonCategory: 'skeletonCategory',
  skeletonRating: 'skeletonRating',
  skeletonPrice: 'skeletonPrice',
  skeletonButton: 'skeletonButton',
}));

describe('ProductCardSkeleton', () => {
  it('should render all skeleton elements', () => {
    render(<ProductCardSkeleton />);

    // You can use a `data-testid` to make your selectors more resilient to changes
    // in class names or roles, but for a skeleton component, checking for the
    // role and aria attributes is also a good practice.

    // A simple check that the main container is present
    const skeletonContainer = screen.getByRole('status', { hidden: true });
    expect(skeletonContainer).toBeInTheDocument();

    // Check that all the child skeleton elements are present based on their classes
    // This requires a mock setup that returns the class names
    expect(skeletonContainer).toHaveClass('skeletonCard');
    
    // You can assert for the presence of child elements as well
    // Since the children are all divs without text, we need to select them by their class names.
    // If your mock is set up correctly, the classes will be strings.
    const allDivs = skeletonContainer.querySelectorAll('div');
    const classList = Array.from(allDivs).map(div => div.className);
    
    expect(classList).toContain('skeletonImage');
    expect(classList).toContain('skeletonTitle');
    expect(classList).toContain('skeletonCategory');
    expect(classList).toContain('skeletonRating');
    expect(classList).toContain('skeletonPrice');
    expect(classList).toContain('skeletonButton');
  });
});