import React, { useState, useEffect } from 'react';
import SubjectCard from './Subjects/SubjectCard';
import AssignmentCard from './Assignments/AssignmentCard';
import fetchContent from '../context/fetchContent';
import { Box, Text, HStack , Heading} from '@chakra-ui/react';
import AddSubject from './Subjects/AddSubject';
import AddAssignment from './Assignments/AddAssignment';
import ExamCard from './Exams/ExamCard';
import AddExam from './Exams/AddExam';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';



const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const assignementsUrl = 'http://localhost:3001/assignments';
  const subjectsUrl = 'http://localhost:3001/subjects';
  const examsUrl = 'http://localhost:3001/exams';

  const fetchSubjects = () => {
    fetchContent('subjects', setSubjects, subjectsUrl, setIsLoading);
  };

  const fetchAssignments = () => {
    fetchContent('assignments', setAssignments, assignementsUrl, setIsLoading);
  }

  const fetchExams = () => {
    fetchContent('exams', setExams, examsUrl, setIsLoading);
  }

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
    fetchExams();
  }, []);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  const localizer = momentLocalizer(moment);
  const myEventsList = assignments.map(assignment => ({
    title: assignment.title,
    start: new Date(assignment.due_date),
    end: new Date(assignment.due_date),
    allDay: false,
    resource: assignment,
  }));

  return (
    <Box padding={4} >
      <Heading as="h1" size="xl" pb={10}>My Dashboard</Heading>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500}}
      />
      <HStack gap={10} align="flex-start" py={10}>
        <Box>
          <Text fontSize="xl" mb={4}>Subjects <AddSubject onSubjectsUpdate={fetchSubjects}/></Text>
          {subjects.map(subject => <SubjectCard key={subject.subject_id} subject={subject} />)}
        </Box>
        <Box>
          <Text fontSize="xl" mb={4}>Assignments <AddAssignment subjects={subjects} onAssignmentsUpdate={fetchAssignments}/></Text>
          {assignments.map(assignment => <AssignmentCard key={assignment.assignment_id} assignment={assignment} />)}
        </Box>
        <Box>
          <Text fontSize="xl" mb={4}>Exams <AddExam subjects={subjects} onExamsUpdate={fetchExams} /></Text>
          {exams.map(exam => <ExamCard key={exam.exam_id} exam={exam}/>)}
        </Box>

      </HStack>
    </Box>
  );
};

export default Dashboard;