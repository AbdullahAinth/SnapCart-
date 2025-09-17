import React from "react";
import { Product } from "../../types";
import { useCart } from "../../context/CartContext";
import RatingStars from "../RatingStars/RatingStars";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const ratingValue =
    typeof product.rating === "number"
      ? product.rating
      : (product.rating as any)?.rate || 0;

  const ratingCount =
    typeof product.rating === "number"
      ? 0
      : (product.rating as any)?.count || 0;

  const productImage =
    product.image || product.images?.[0] || product.thumbnail || "";

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={productImage}
          alt={product.title}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.category}>{product.category}</p>

        <div className={styles.rating}>
          <RatingStars rating={ratingValue} count={ratingCount} />
          <span className={styles.ratingText}>{ratingValue} / 5</span>
        </div>

        <p className={styles.price}>${product.price.toFixed(2)}</p>

        <button
          className="button"
          // ✅ Keep id as a number (no conversion needed)
          onClick={() =>
            addToCart({
              ...product,
              id: product.id,
            })
          }
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
