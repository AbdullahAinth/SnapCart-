// src/components/ProductCardSkeleton/ProductCardSkeleton.js
import React from 'react';
import styles from './ProductCardSkeleton.module.css';

const ProductCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard} role="status" aria-hidden="true">
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonCategory}></div>
      <div className={styles.skeletonRating}></div>
      <div className={styles.skeletonPrice}></div>
      <div className={styles.skeletonButton}></div>
    </div>
  );
};

export default ProductCardSkeleton;