import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/CartItem/CartItem';
import styles from './ShoppingCartPage.module.css';

const ShoppingCartPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();

  const handleClearCart = () => {
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Your cart is empty!</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="button">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h1>Your Shopping Cart</h1>
      <div className={styles.cartItemsContainer}>
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className={styles.cartSummary}>
        <div className={styles.total}>
          <h3>Total:</h3>
          <span>${getTotalPrice().toFixed(2)}</span>
        </div>
        <div className={styles.actions}>
          <button onClick={handleClearCart} className={`${styles.clearButton} button`}>
            Clear Cart
          </button>
          <Link to="/checkout" className={`${styles.checkoutButton} button`}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;