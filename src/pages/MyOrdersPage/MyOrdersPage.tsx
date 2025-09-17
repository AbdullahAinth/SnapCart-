import React from 'react';
import styles from './MyOrdersPage.module.css';

interface OrderItem {
  name: string;
  qty: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
}

const MyOrdersPage: React.FC = () => {
  const mockOrders: Order[] = [
    {
      id: '12345',
      date: 'July 1, 2025',
      total: 150.0,
      items: [
        { name: 'Product A', qty: 1 },
        { name: 'Product B', qty: 2 },
      ],
    },
    {
      id: '12346',
      date: 'June 15, 2025',
      total: 75.5,
      items: [{ name: 'Product C', qty: 1 }],
    },
  ];

  return (
    <div className={styles.myOrdersPage}>
      <h1>My Orders</h1>
      <p>This is where your order history would be displayed.</p>

      <div className={styles.mockOrders}>
        {mockOrders.map((order) => (
          <div key={order.id} className={styles.orderCard}>
            <h3>Order #{order.id}</h3>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} (x{item.qty})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className={styles.disclaimer}>
        <em>Note:</em> This is mock data. Real orders will appear here once implemented.
      </p>
    </div>
  );
};

export default MyOrdersPage;
