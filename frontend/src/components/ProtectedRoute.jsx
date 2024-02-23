// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { authData } = useAuth();

  if (!authData) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;