// src/components/Navbar/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main Navigation">
      <Link to="/" className={styles.logo}>SnapCart</Link>

      <ul className={styles.navLinks}>
        <li><Link to="/">Products</Link></li>
        <li><Link to="/my-orders">My Orders</Link></li>
        <li><Link to="/change-password">Change Password</Link></li>
        <li>
          <Link to="/cart" className={styles.cartLink}>
            🛒 Cart ({getCartItemCount()})
          </Link>
        </li>
        <li>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
