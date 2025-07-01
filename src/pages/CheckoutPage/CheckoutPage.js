import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    paymentMethod: 'credit_card', // Default payment method
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      navigate('/');
      return;
    }

    // Mock order processing
    console.log("Order placed:", {
      items: cartItems,
      total: getTotalPrice(),
      customerInfo: formData,
    });

    toast.success("Order placed successfully! Thank you for your purchase.");
    clearCart(); // Clear the cart after successful checkout
    navigate('/'); // Redirect to home page
  };

  return (
    <div className={styles.checkoutPage}>
      <h1>Checkout</h1>
      <div className={styles.checkoutContent}>
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.title} (x{item.quantity}) - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
          <div className={styles.totalPrice}>
            <h3>Total:</h3>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          <h2>Shipping Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>

          <h2>Payment Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="input"
            >
              <option value="credit_card">Credit Card (Mock)</option>
              <option value="paypal">PayPal (Mock)</option>
              {/* Add more mock payment options */}
            </select>
          </div>
          {formData.paymentMethod === 'credit_card' && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" placeholder="**** **** **** ****" className="input" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" className="input" required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input type="text" id="cvv" name="cvv" placeholder="123" className="input" required />
              </div>
            </>
          )}


          <button type="submit" className={`${styles.placeOrderButton} button`}>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;