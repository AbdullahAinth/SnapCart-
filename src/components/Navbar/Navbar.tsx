// src/components/Navbar/Navbar.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // Import the useUser hook

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { isLoggedIn, logout } = useUser(); // Get login state and logout function from UserContext
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const totalQuantity: number = cartItems.reduce(
    (acc: number, item: { quantity: number }) => acc + item.quantity,
    0
  );

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>SnapCart</Link>

      <div className={styles.hamburger} onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        {/* Conditionally render Login or Logout */}
        {isLoggedIn ? (
          <>
            <li><Link to="/my-orders" onClick={closeMenu}>My Orders</Link></li>
            <li><Link to="/change-password" onClick={closeMenu}>Change Password</Link></li>
            <li><button onClick={handleLogout} className={styles.authButton}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login" onClick={closeMenu} className={styles.authButton}>Login</Link></li>
        )}
        <li>
          <Link to="/cart" onClick={closeMenu} className={styles.cartLink}>
            <FaShoppingCart />
            {totalQuantity > 0 && (
              <span className={styles.cartBadge}>{totalQuantity}</span>
            )}
          </Link>
        </li>
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