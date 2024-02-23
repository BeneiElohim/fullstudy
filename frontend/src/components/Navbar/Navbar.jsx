// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {


  return (
    <div className="navbar">
      <h2>StudyTracker</h2>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {/* Add more navigation links as needed */}
      </ul>
    </div>
  );
};

export default Navbar;