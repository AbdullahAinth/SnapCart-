// src/components/Navbar/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>SnapCart</Link>

      <div className={styles.hamburger} onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li>
          <Link to="/cart" onClick={closeMenu} className={styles.cartLink}>
            <FaShoppingCart />
            {totalQuantity > 0 && <span className={styles.cartBadge}>{totalQuantity}</span>}
          </Link>
        </li>
        <li><Link to="/my-orders" onClick={closeMenu}>My Orders</Link></li>
        <li><Link to="/change-password" onClick={closeMenu}>Change Password</Link></li>
        <li>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
