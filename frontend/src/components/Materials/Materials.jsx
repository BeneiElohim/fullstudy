// Materials.jsx
import React, { useState, useEffect } from 'react';
import {
  VStack,
  Heading,
  Button,
  Wrap,
  WrapItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure
} from '@chakra-ui/react';
import AddMaterial from './AddMaterial';
import fetchContent from '../../context/fetchContent';
import MaterialItem from './MaterialItem';
import DeleteMaterial from './DeleteMaterial';

const Materials = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const materialsUrl = "http://localhost:3001/materials";
  const subjectsUrl = "http://localhost:3001/subjects";

  const fetchMaterials = () => {
    fetchContent('studyMaterials', setStudyMaterials, materialsUrl, setIsLoading);
    fetchContent('subjects', setSubjects, subjectsUrl, setIsLoading);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

 
const handleDeleteMaterial = () => {
  if (selectedMaterial) {
    const authData = JSON.parse(sessionStorage.getItem('authData'));
    const token = authData.token;

    fetch(`http://localhost:3001/materials/delete-material/${selectedMaterial.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'deleted') {
          setStudyMaterials(prevMaterials => prevMaterials.filter(material => material.id !== selectedMaterial.id));
          setSelectedMaterial(null);
        } else {
          console.error('Failed to delete material:', data.message);
        }
      })
      .catch(err => console.error('Error:', err));
  }
  onClose();
};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <VStack align="stretch" spacing={8} padding={8}>
      <Heading as="h1" size="xl">Study Materials <AddMaterial subjects={subjects} onMaterialsUpdated={fetchMaterials} /></Heading>
      <VStack align="flex-start" spacing={8}>
        {/* Subjects Column */}
        <Heading as="h2" size="lg">Subjects</Heading>
        <Wrap align="stretch" spacing={4} minWidth="150px" maxWidth="95%">
          {subjects.map((subject, index) => (
            <WrapItem key={index}>
              <Button
                variant={selectedClass === subject.subject_name ? 'solid' : 'outline'}
                onClick={() => setSelectedClass(subject.subject_name)}
                colorScheme='blue'
              >
                {subject.subject_name}
              </Button>
            </WrapItem>
          ))}
        </Wrap>

        {/* Materials Column */}
        {selectedClass && (
          <VStack align="flex-start" spacing={8} width="100%">
            <Heading as="h2" size="lg">Material</Heading>
            <Wrap justify="center" spacing={4}>
              {['Text', 'Document', 'Link'].map((type, typeIndex) => (
                <WrapItem key={typeIndex} flexBasis={{ base: '100%', sm: '50%', md: '33.33%', lg:'12.5%' }}>
                  <Box maxHeight="50vh" overflowY="auto" pr={5} minW="160px" flex="1">
                    <VStack align="stretch" spacing={2}>
                      <Heading as="h3" size="sm">{type}</Heading>
                      {studyMaterials.filter(material => material.material_type === type && material.subject_name === selectedClass).map((material, materialIndex) => (
                        <HStack key={materialIndex}> {/* Use React.Fragment to wrap multiple elements */}
                          <MaterialItem material={material} />
                          <DeleteMaterial materialId={material.material_id} onMaterialsUpdated={fetchMaterials} />
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </WrapItem>
              ))}
            </Wrap>
          </VStack>
        )}
      </VStack>

      {/* Delete Material Alert */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={null}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Material
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this material?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteMaterial} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  ); 
};

export default Materials;


