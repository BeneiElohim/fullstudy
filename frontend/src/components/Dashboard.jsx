import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Retrieve the authData from sessionStorage and parse it to get the token
        const authData = JSON.parse(sessionStorage.getItem('authData'));
        const token = authData ? authData.token : null;
        console.log('Token from sessionStorage:', token); // Debug: Log the token to ensure it's being retrieved

        // Check if the token is null and handle the case appropriately
        if (!token) {
          console.error('No token found in sessionStorage');
          // You can redirect to login page or show an error message here
          return;
        }

        // Include the token in the Authorization header
        const response = await fetch('http://localhost:3001/api/courses', {
          method: 'GET', // Explicitly specify the method
          headers: {
            'Content-Type': 'application/json', // Ensure you're setting the content type
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Could not fetch courses, status: ${response.status}`); // Include the status code in the error message for more context
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course.course_id}>{course.course_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;