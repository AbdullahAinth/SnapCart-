import React from 'react';
import { render, screen } from '@testing-library/react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import RatingStars from './RatingStars';
import '@testing-library/jest-dom';

// Mock the react-icons to ensure we're testing the component logic, not the icons themselves
jest.mock('react-icons/fa', () => ({
  FaStar: () => <span data-testid="full-star" />,
  FaRegStar: () => <span data-testid="empty-star" />,
  FaStarHalfAlt: () => <span data-testid="half-star" />,
}));

describe('RatingStars', () => {
  // Test case for a whole number rating, which is the most common scenario.
  test('renders the correct number of full and empty stars for a whole number rating', () => {
    const rating = 4;
    render(<RatingStars rating={rating} />);

    // Assert that there are 4 full stars and 1 empty star
    expect(screen.getAllByTestId('full-star')).toHaveLength(4);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(1);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();

    // Verify the aria-label for accessibility
    expect(screen.getByLabelText(`Rating: ${rating} out of 5`)).toBeInTheDocument();
  });

  // This is the key test to cover the previously missed line (the half-star logic).
  test('renders a half star for a decimal rating', () => {
    const rating = 3.5;
    render(<RatingStars rating={rating} />);

    // Assert that there are 3 full stars, 1 half star, and 1 empty star
    expect(screen.getAllByTestId('full-star')).toHaveLength(3);
    expect(screen.getByTestId('half-star')).toBeInTheDocument();
    expect(screen.getAllByTestId('empty-star')).toHaveLength(1);

    // Verify the aria-label for accessibility
    expect(screen.getByLabelText(`Rating: ${rating} out of 5`)).toBeInTheDocument();
  });

  // Test case for a zero rating
  test('renders only empty stars for a rating of 0', () => {
    const rating = 0;
    render(<RatingStars rating={rating} />);

    // Assert that there are no full or half stars, and 5 empty stars
    expect(screen.queryByTestId('full-star')).not.toBeInTheDocument();
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('empty-star')).toHaveLength(5);

    // Verify the aria-label for accessibility
    expect(screen.getByLabelText(`Rating: ${rating} out of 5`)).toBeInTheDocument();
  });

  // Test case for a perfect 5-star rating
  test('renders only full stars for a perfect 5-star rating', () => {
    const rating = 5;
    render(<RatingStars rating={rating} />);

    // Assert that there are 5 full stars and no half or empty stars
    expect(screen.getAllByTestId('full-star')).toHaveLength(5);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-star')).not.toBeInTheDocument();

    // Verify the aria-label for accessibility
    expect(screen.getByLabelText(`Rating: ${rating} out of 5`)).toBeInTheDocument();
  });

  // Test case to ensure the rating count is displayed correctly
  test('renders the rating count when provided', () => {
    const rating = 4;
    const count = 120;
    render(<RatingStars rating={rating} count={count} />);

    // Assert that the count is rendered in the span
    expect(screen.getByText(`(${count})`)).toBeInTheDocument();
  });

  // Test case to ensure the rating count is NOT displayed when not provided
  test('does not render the rating count when not provided', () => {
    render(<RatingStars rating={4} />);

    // Assert that the count element is not in the document
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });
});