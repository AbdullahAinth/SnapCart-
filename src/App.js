// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

// Core Components
import Navbar from './components/Navbar/Navbar';
import CustomCursor from './components/CustomCursor/CustomCursor';

// Pages
import ProductListingPage from './pages/ProductListingPage/ProductlistingPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage';
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <UserProvider>
            <CustomCursor />
            <Toaster position="bottom-right" />
            <Navbar />
            <main className="container">
              <Routes>
                <Route path="/" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
                <Route path="*" element={<ProductListingPage />} />
              </Routes>
            </main>
          </UserProvider>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
