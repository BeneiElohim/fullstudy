import React, { useState, useEffect } from 'react';
import fetchContent from '../../context/fetchContent';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  let url = 'http://localhost:3001/api/assignments';
  useEffect(() => {
    fetchContent('assignments', setAssignments, url);
  }, []);

  return (
    <>
      <h2>Assignments</h2>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.assignment_id}>{assignment.title}</li>
        ))}
      </ul>
    </>
  )
}

export default Assignments