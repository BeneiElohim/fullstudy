import React from 'react';
import { Box, Text , Badge} from '@chakra-ui/react';

const ExamCard = ({ exam }) => {
  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Text fontSize="sm">{exam.subject_name}</Text>
      <Text fontSize="xl">{exam.title}</Text>
      <Text fontSize="xs">On: {exam.exam_date}</Text>
      <Badge colorScheme={exam.priority === 'High' ? 'red' : exam.priority === 'Medium' ? 'orange' : 'green'}>
        {exam.priority}
      </Badge>
    </Box>
  );
};

export default ExamCard;
