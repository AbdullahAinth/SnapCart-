// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const getInitialLoginState = () => {
    try {
      return localStorage.getItem('isLoggedIn') === 'true';
    } catch (err) {
      console.error('Failed to access localStorage for isLoggedIn:', err);
      return false;
    }
  };

  const getInitialUserName = () => {
    try {
      return localStorage.getItem('userName') || 'Guest';
    } catch (err) {
      console.error('Failed to access localStorage for userName:', err);
      return 'Guest';
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState);
  const [userName, setUserName] = useState(getInitialUserName);

  useEffect(() => {
    try {
      localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      localStorage.setItem('userName', userName);
    } catch (err) {
      console.error('Failed to write to localStorage:', err);
    }
  }, [isLoggedIn, userName]);

  const login = (mockUsername = 'User') => {
    setIsLoggedIn(true);
    setUserName(mockUsername);
    toast.success(`Welcome, ${mockUsername}! You are logged in.`);
  };

  const logout = (onLogoutCallback) => {
    setIsLoggedIn(false);
    setUserName('Guest');
    toast.success('You have been logged out.');

    // Optional callback for actions like clearing cart or redirecting
    if (typeof onLogoutCallback === 'function') {
      onLogoutCallback();
    }
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
