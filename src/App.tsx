// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CustomCursor from './components/CustomCursor/CustomCursor';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext'; 

// Import your existing pages
import ProductListingPage from './pages/ProductListingPage/ProductlistingPage';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage';
import ChangePasswordPage from './pages/ChangePasswordPage/ChangePasswordPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage'; 
import LoginPage from './pages/LoginPage/LoginPage'; 
import OnboardingPage from './pages/OnboardingPage/OnboardingPage'; // Import the new Onboarding Page

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <ThemeProvider>
          <ProductProvider>
            <CartProvider>
              <CustomCursor />
              <Navbar />
              <main>
                <Routes>
                  {/* Home Page */}
                  <Route path="/" element={<ProductListingPage />} />
                  
                  {/* Shopping Cart Page */}
                  <Route path="/cart" element={<ShoppingCartPage />} />

                  {/* User Account Pages */}
                  <Route path="/my-orders" element={<MyOrdersPage />} />
                  <Route path="/change-password" element={<ChangePasswordPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  
                  {/* Auth Pages */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />

                  {/* Fallback route */}
                  <Route path="*" element={<ProductListingPage />} /> 
                </Routes>
              </main>
            </CartProvider>
          </ProductProvider>
        </ThemeProvider>
      </UserProvider>
    </Router>
  );
};

export default App;