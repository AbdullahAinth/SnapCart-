// src/pages/CheckoutPage/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return navigate('/');
    }

    // Basic validation for required fields
    const { name, address, email, paymentMethod, cardNumber, expiryDate, cvv } = formData;
    if (!name.trim() || !address.trim() || !email.trim()) {
      return toast.error("Please fill out all required fields.");
    }

    if (paymentMethod === 'credit_card' && (!cardNumber || !expiryDate || !cvv)) {
      return toast.error("Please enter all credit card details.");
    }

    // Mock order processing
    console.log("Order placed:", {
      items: cart,
      total: getTotalPrice(),
      customerInfo: formData,
    });

    toast.success("Order placed successfully! Thank you for your purchase.");
    clearCart();
    navigate('/');
  };

  return (
    <div className={styles.checkoutPage}>
      <h1>Checkout</h1>
      <div className={styles.checkoutContent}>
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.title} (x{item.qty}) - ${item.price.toFixed(2)}
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
              className={styles.input}
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
              className={styles.input}
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
              className={styles.input}
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
              className={styles.input}
            >
              <option value="credit_card">Credit Card (Mock)</option>
              <option value="paypal">PayPal (Mock)</option>
            </select>
          </div>

          {formData.paymentMethod === 'credit_card' && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="**** **** **** ****"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={styles.input}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className={styles.placeOrderButton}>
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
