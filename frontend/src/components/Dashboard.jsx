import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Include the token in the Authorization header
        const response = await fetch('http://localhost:3001/api/courses', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Could not fetch courses');
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