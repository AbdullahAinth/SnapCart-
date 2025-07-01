// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Mock login state. In a real app, this would come from an API/token.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage for a mock login status
    try {
      const loggedInStatus = localStorage.getItem('isLoggedIn');
      return loggedInStatus === 'true'; // Convert string to boolean
    } catch (error) {
      console.error("Failed to read login status from localStorage", error);
      return false;
    }
  });
  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('userName') || 'Guest';
    } catch (error) {
      return 'Guest';
    }
  });

  // Persist login state to localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userName', userName);
  }, [isLoggedIn, userName]);


  const login = (mockUsername = 'User') => {
    setIsLoggedIn(true);
    setUserName(mockUsername);
    toast.success(`Welcome, ${mockUsername}! You are logged in.`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('Guest');
    toast.success("You have been logged out.");
    // Optionally clear cart on logout
    // const { clearCart } = useCart(); // Would need to import useCart here or pass it down
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};