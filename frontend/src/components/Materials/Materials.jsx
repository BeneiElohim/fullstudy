import React, { useState, useEffect } from 'react';
import { VStack, HStack, Heading, Button, Text } from '@chakra-ui/react'; // Assuming you're using Chakra UI
import AddMaterial from './AddMaterial'; // Assuming AddMaterial is a component you've defined
import fetchContent from '../../context/fetchContent';

const Materials = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const url = "http://localhost:3001/materials"

  const fetchMaterials = () => {
    fetchContent('studyMaterials', setStudyMaterials, url, setIsLoading);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);
  

  // Extract unique subjects
  const subjects = Array.from(new Set(studyMaterials.map(item => item.subject_name))).map(subject_name => {
    return {
      subject_name,
      subject_id: studyMaterials.find(item => item.subject_name === subject_name).subject_id
    };
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <VStack align="stretch" spacing={8} padding={8}>
      <Heading as="h1" size="xl">Study Materials <AddMaterial subjects={subjects} onMaterialsUpdated={fetchMaterials} /></Heading>
      <VStack align="flex-start" spacing={8}>

        {/* Courses Column */}
        <Heading as="h2" size="md" p="20px">Courses</Heading>
        <HStack align="stretch" spacing={4} minWidth="150px">
          {subjects.map((subject, index) => (
            <Button
              key={index}
              variant={selectedClass === subject.subject_name ? 'solid' : 'outline'}
              onClick={() => setSelectedClass(subject.subject_name)}
            >
              {subject.subject_name}
            </Button>
          ))}
        </HStack>

        {/* Types Column */}
        {selectedClass && (
          <VStack align="flex-start" spacing={8}>
            <Heading as="h2" size="md">Material</Heading>
            <HStack align={'flex-start'}>
              {['Text', 'Document', 'Link', 'Image'].map((type, typeIndex) => (
                <VStack key={typeIndex} align="stretch" spacing={2} pr={20}>
                  <Heading as="h3" size="sm">{type}</Heading>
                  {studyMaterials.filter(material => material.material_type === type && material.subject_name === selectedClass).map((material, materialIndex) => (
                    <Text key={materialIndex}>{material.title}</Text>
                  ))}
                </VStack>
              ))}
            </HStack>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default Materials;