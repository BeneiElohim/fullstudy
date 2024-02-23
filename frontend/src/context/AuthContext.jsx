// src/context/AuthContext.js
import React, { createContext, useContext, useState , useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    // Check localStorage and sessionStorage for authData
    const storedAuthData = JSON.parse(localStorage.getItem('authData')) || JSON.parse(sessionStorage.getItem('authData'));
    if (storedAuthData) {
      setAuthData(storedAuthData);
    }
  }, []);

  const value = { authData, setAuthData };

  const login = (data) => {
    setAuthData(data);
    
  };

  // Add a logout function in your AuthProvider or wherever appropriate
  const logout = () => {
    console.log('Logging out...'); // Debugging line
    setAuthData(null);
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    window.location.href = '/login';
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};