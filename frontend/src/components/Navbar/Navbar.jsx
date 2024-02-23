// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useAuth, AuthProvider } from '../../context/AuthContext';

const Navbar = () => {
  const logout = () => {
    console.log('Logging out...'); // Debugging line
    setAuthData(null);
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    window.location.href = '/login';
  };

  return (
    <div className="navbar">
      <h2>StudyTracker</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {/* Add more navigation links as needed */}
      </ul>
      <button onClick={logout} className="logout-button">Logout</button>{/* Logout button:  */}
    </div>
  );
};

export default Navbar;