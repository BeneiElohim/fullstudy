import React from 'react';
import { Box, Text, Badge } from '@chakra-ui/react';

const AssignmentCard = ({ assignment }) => {
  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Text fontSize="xl">{assignment.title}</Text>
      <Badge colorScheme={assignment.priority === 'High' ? 'red' : assignment.priority === 'Medium' ? 'orange' : 'green'}>
        {assignment.priority}
      </Badge>
    </Box>
  );
};

export default AssignmentCard;