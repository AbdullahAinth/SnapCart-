
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Context Providers
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';

// Toast Notifications
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <UserProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </UserProvider>
    <Toaster position="bottom-right" />
  </React.StrictMode>
);

reportWebVitals();