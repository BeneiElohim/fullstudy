import React, { useState, useEffect } from 'react';
import { 
  VStack, 
  HStack, 
  Heading, 
  Button,
  Box, 
  Wrap,
  WrapItem } from '@chakra-ui/react';
import AddMaterial from './AddMaterial';
import fetchContent from '../../context/fetchContent';
import MaterialItem from './MaterialItem';

const Materials = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  const materialsUrl = "http://localhost:3001/materials"
  const subjectsUrl = "http://localhost:3001/subjects"

  const fetchMaterials = () => {
    fetchContent('studyMaterials', setStudyMaterials, materialsUrl, setIsLoading);
    fetchContent('subjects', setSubjects, subjectsUrl, setIsLoading);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);
  


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <VStack align="stretch" spacing={8} padding={8}>
      <Heading as="h1" size="xl">Study Materials <AddMaterial subjects={subjects} onMaterialsUpdated={fetchMaterials} /></Heading>
      <VStack align="flex-start" spacing={8}>

        {/* Subjects Column */}
        <Heading as="h2" size="lg" >Subjects</Heading>
        <Wrap align="stretch" spacing={4} minWidth="150px" maxWidth="95%">
          {subjects.map((subject, index) => (
            <WrapItem key={index}>
              <Button
                key={index}
                variant={selectedClass === subject.subject_name ? 'solid' : 'outline'}
                onClick={() => setSelectedClass(subject.subject_name)}
              >
                {subject.subject_name}
              </Button>
            </WrapItem>
          ))}
        </Wrap>

        {/* Types Column */}
        {(selectedClass) && (
          <VStack align="flex-start" spacing={8} width="100%">
            <Heading as="h2" size="lg">Material</Heading>
            <Wrap justify="center" spacing={4}>
              {['Text', 'Document', 'Link'].map((type, typeIndex) => (
                <WrapItem key={typeIndex} flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg:'12.5%' }}>
                  <Box maxHeight="50vh" overflowY="auto" pr={5} minW="160px" flex="1">
                    <VStack align="stretch" spacing={2}>
                      <Heading as="h3" size="sm">{type}</Heading>
                      {studyMaterials.filter(material => material.material_type === type && material.subject_name === selectedClass).map((material, materialIndex) => (
                        <MaterialItem key={materialIndex} material={material} />
                      ))}
                    </VStack>
                  </Box>
                </WrapItem>
              ))}
            </Wrap>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default Materials;