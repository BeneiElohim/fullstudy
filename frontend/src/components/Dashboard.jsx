import React, { useState, useEffect } from 'react';
import Courses from './Courses/Courses';
import Assignments from './Assignments/Assignments';

const Dashboard = () => {

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Courses</h2>
      <Courses />
      <Assignments /> 
    </div>
  );
};

export default Dashboard;