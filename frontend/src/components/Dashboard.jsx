import React, { useState, useEffect } from 'react';
import SubjectCard from './Subjects/SubjectCard';
import AssignmentCard from './Assignments/AssignmentCard';
import fetchContent from '../context/fetchContent';
import { Box, Text, HStack } from '@chakra-ui/react';

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const assignementsUrl = 'http://localhost:3001/assignments';
  const subjectsUrls = 'http://localhost:3001/subjects';

  useEffect(() => {
    fetchContent('assignments', setAssignments, assignementsUrl, setIsLoading );
    fetchContent('subjects', setSubjects, subjectsUrls, setIsLoading); 
  }, []);

  let today = new Date();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box padding={4} >
      <Text fontSize="2xl" mb={4}>My Dashboard</Text>
      <Text align="center" fontSize="xl" mb={4}>Today's Date: {today.toLocaleDateString()}</Text>
      <HStack gap={10} align="flex-start">
        <Box>
          <Text fontSize="xl" mb={4}>Subjects</Text>
          {subjects.map(subject => <SubjectCard key={subject.subject_id} subject={subject} />)}
        </Box>
        <Box>
          <Text fontSize="xl" mb={4}>Assignments</Text>
          {assignments.map(assignment => <AssignmentCard key={assignment.assignment_id} assignment={assignment} />)}
        </Box>

      </HStack>
    </Box>
  );
};

export default Dashboard;