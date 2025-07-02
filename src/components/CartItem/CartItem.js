import React from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CartItem.module.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className={styles.cartItem}>
      <img src={item.image} alt={item.title} className={styles.itemImage} />
      <div className={styles.itemDetails}>
        <h4 className={styles.itemTitle}>{item.title}</h4>
        <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
      </div>
      <div className={styles.itemControls}>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          className={styles.quantityInput}
        />
        <button
          onClick={() => removeFromCart(item.id)}
          className={styles.removeButton}
        >
          Remove
        </button>
      </div>
      <div className={styles.itemSubtotal}>
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;
