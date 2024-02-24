import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const CourseCard = ({ course }) => {
  return (
    <Box p={4} shadow="md" borderWidth="1px">
      <Text fontSize="xl">{course.course_name}</Text>
    </Box>
  );
};

export default CourseCard;
