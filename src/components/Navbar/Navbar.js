// src/components/Navbar/Navbar.js
import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // <-- NEW
import styles from './Navbar.module.css';

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const { isLoggedIn, userName, logout, login } = useUser(); // <-- NEW
  const itemCount = getCartItemCount();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false); // Close dropdown after logout
  };

  // Simple mock login for demonstration
  const handleLogin = () => {
    login('MockUser'); // You can pass any mock username
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          Snapcart {/* Updated name */}
        </Link>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/">Products</Link>
          </li>
          <li>
            <Link to="/cart" className={styles.cartLink}>
              Cart ({itemCount})
            </Link>
          </li>
          <li className={styles.profileSection}> {/* New list item for profile */}
            {isLoggedIn ? (
              <div className={styles.profileDropdownToggle} onClick={toggleDropdown}>
                Hi, {userName} ▼
              </div>
            ) : (
              <button onClick={handleLogin} className={styles.loginButton}>
                Login
              </button>
            )}

            {isLoggedIn && isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/my-orders" onClick={() => setIsDropdownOpen(false)}>My Orders</Link>
                <Link to="/change-password" onClick={() => setIsDropdownOpen(false)}>Change Password</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;