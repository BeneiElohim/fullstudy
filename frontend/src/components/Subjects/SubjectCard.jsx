import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const SubjectCard = ({ subject }) => {
  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Text fontSize="xl">{subject.subject_name}</Text>
    </Box>
  );
};

export default SubjectCard;
