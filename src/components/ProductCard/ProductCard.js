// src/components/ProductCard/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';
import RatingStars from '../RatingStars/RatingStars';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    addToCart(product);
    toast.success(`${product.title} added to cart`, {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  return (
    <div className={styles.productCard}>
      <Link to={`/product/${product.id}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.productImage}
          />
        </div>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <p className={styles.productCategory}>{product.category}</p>
        <RatingStars 
          rating={typeof product.rating === 'number' ? product.rating : product.rating.rate} 
          count={product.rating?.count || 0} 
        />
        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
      </Link>
      <button
        className={`${styles.addToCartButton} button`}
        onClick={handleAddToCart}
        aria-label={`Add ${product.title} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
