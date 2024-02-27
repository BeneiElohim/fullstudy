import React, { useState, useEffect } from 'react';
import SubjectCard from './Subjects/SubjectCard';
import AssignmentCard from './Assignments/AssignmentCard';
import fetchContent from '../context/fetchContent';
import { Box, Text, HStack , Heading} from '@chakra-ui/react';
import AddSubject from './Subjects/AddSubject';

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const assignementsUrl = 'http://localhost:3001/assignments';
  const subjectsUrl = 'http://localhost:3001/subjects';

  const fetchSubjects = () => {
    fetchContent('subjects', setSubjects, subjectsUrl, setIsLoading);
  };

  const fetchAssignments = () => {
    fetchContent('assignments', setAssignments, assignementsUrl, setIsLoading);
  }

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
  }, []);

  let today = new Date();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box padding={4} >
      <Heading as="h1" size="xl" pb={10}>My Dashboard</Heading>
      <Text align="center" fontSize="xl" mb={4}>Today's Date: {today.toLocaleDateString()}</Text>
      <HStack gap={10} align="flex-start">
        <Box>
          <Text fontSize="xl" mb={4}>Subjects <AddSubject onSubjectsUpdate={fetchSubjects}/></Text>
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