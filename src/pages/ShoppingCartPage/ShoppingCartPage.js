// src/pages/ShoppingCartPage/ShoppingCartPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './ShoppingCartPage.module.css';

const ShoppingCartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (item, event) => {
    const newQty = parseInt(event.target.value, 10);
    if (!isNaN(newQty)) {
      updateQuantity(item.id, newQty);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      navigate('/checkout');
    } else {
      alert("Your cart is empty. Please add items before proceeding to checkout.");
    }
  };

  return (
    <div className={styles.cartPage}>
      <h1>Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Start adding items to see them here.</p>
        </div>
      ) : (
        <>
          <div className={styles.cartItemsContainer}>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.title} className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                    <input
                      type="number"
                      value={item.qty}
                      min="1"
                      onChange={(e) => handleQuantityChange(item, e)}
                    />
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>
                    Remove
                  </button>
                </div>
                <div className={styles.itemSubtotal}>
                  Subtotal: ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.total}>
              <h3>Total:</h3>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <button onClick={handleProceedToCheckout} className={`${styles.checkoutButton} button`}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCartPage;
