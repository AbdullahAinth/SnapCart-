import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/product';
import { useCart } from '../../context/CartContext';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
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
        <img src={product.image} alt={product.title} className={styles.productImage} />
      </div>
      <div className={styles.infoContainer}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productCategory}>Category: {product.category}</p>
        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
        <p className={styles.productDescription}>{product.description}</p>
        <button onClick={() => addToCart(product)} className="button">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;