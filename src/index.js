// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext'; // <-- NEW
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider> {/* <-- WRAP WITH UserProvider */}
      <CartProvider>
        <App />
        <Toaster />
      </CartProvider>
    </UserProvider>
  </React.StrictMode>
);

reportWebVitals();