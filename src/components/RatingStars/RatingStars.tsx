import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import styles from './RatingStars.module.css';

interface RatingStarsProps {
  rating?: number;
  count?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating = 0, count }) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div
      className={styles.ratingContainer}
      aria-label={`Rating: ${roundedRating} out of 5`}
      title={`Rating: ${roundedRating} / 5`}
    >
      <div className={styles.stars}>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className={styles.starIcon} aria-hidden="true" />
        ))}
        {hasHalfStar && (
          <FaStarHalfAlt className={styles.starIcon} aria-hidden="true" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className={styles.starIcon} aria-hidden="true" />
        ))}
      </div>
      {count !== undefined && (
        <span className={styles.ratingCount}>({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
