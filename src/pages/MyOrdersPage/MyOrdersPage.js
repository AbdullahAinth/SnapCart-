// src/pages/MyOrdersPage/MyOrdersPage.js
import React from 'react';
import styles from './MyOrdersPage.module.css'; // Create this CSS module too

const MyOrdersPage = () => {
  return (
    <div className={styles.myOrdersPage}>
      <h1>My Orders</h1>
      <p>This is where your order history would be displayed.</p>
      <div className={styles.mockOrders}>
        <div className={styles.orderCard}>
          <h3>Order #12345</h3>
          <p>Date: July 1, 2025</p>
          <p>Total: $150.00</p>
          <ul>
            <li>Product A (x1)</li>
            <li>Product B (x2)</li>
          </ul>
        </div>
        <div className={styles.orderCard}>
          <h3>Order #12346</h3>
          <p>Date: June 15, 2025</p>
          <p>Total: $75.50</p>
          <ul>
            <li>Product C (x1)</li>
          </ul>
        </div>
      </div>
      <p>Login status: (This section is for mock data, no real orders yet.)</p>
    </div>
  );
};

export default MyOrdersPage;