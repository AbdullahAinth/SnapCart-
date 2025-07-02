// src/pages/ProductDetailPage/ProductDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/product';
import { useCart } from '../../context/CartContext';
import RatingStars from '../../components/RatingStars/RatingStars';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading product details...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!product) return <div className={styles.notFound}>Product not found.</div>;

  return (
    <div className={styles.detailPage}>
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.productImage}
        />
      </div>

      <div className={styles.infoContainer}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productCategory}>Category: {product.category}</p>

        <div className={styles.productRating}>
          <RatingStars rating={product.rating?.rate || 0} count={product.rating?.count} />
          <span className={styles.ratingText}>{product.rating?.rate || 0} / 5</span>
        </div>

        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
        <p className={styles.productDescription}>{product.description}</p>

        <button
          onClick={() => addToCart(product)}
          className="button"
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
