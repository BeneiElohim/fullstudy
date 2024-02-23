import React, { useState, useEffect } from 'react';
import fetchContent from '../../context/fetchContent';

function Courses() {
  const [courses, setCourses] = useState([]);
  let url = 'http://localhost:3001/api/courses';
  useEffect(() => {
    fetchContent('courses', setCourses, url);
  }, []);

  return (
      <ul>
        {courses.map(course => (
          <li key={course.course_id}>{course.course_name}</li>
        ))}
      </ul>
  )
}

export default Courses