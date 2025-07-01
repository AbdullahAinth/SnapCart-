// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductListingPage from './pages/ProductListingPage/ProductlistingPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage'; // <-- NEW
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage'; // <-- NEW
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} /> {/* <-- NEW ROUTE */}
          <Route path="/change-password" element={<ChangePasswordPage />} /> {/* <-- NEW ROUTE */}
          {/* Add a 404 page later if desired */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;