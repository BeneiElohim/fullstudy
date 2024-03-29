import { 
  Button, 
  Text, 
  useDisclosure, 
  Select, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  Input, 
  FormControl, 
  FormLabel, 
  FormErrorMessage, 
  RadioGroup, 
  Stack, 
  Radio, 
  HStack, 
  VStack,
  Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';

function AddMaterial({ subjects, ...props }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [link_url, setLink_Url] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null); 
  const [selectedOption, setSelectedOption] = useState(''); 
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!subject) newErrors.subject = 'Course is required';
    if (!title) newErrors.title = 'Title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    // Determine material_type based on the selectedOption
    let determinedMaterialType = '';
    switch (selectedOption) {
      case 'link':
        determinedMaterialType = 'Link';
        break;
      case 'notes':
        determinedMaterialType = 'Text';
        break;
      case 'file':
        determinedMaterialType = 'Document';
        break;
      default:
        // Handle the case where no option is selected, or it's an unexpected value
        console.error('Invalid selected option for material type');
        return; // You might want to set an error state here instead of returning
    }
  
    const formData = new FormData();
    formData.append('subject_name', subject);
    // Use the determinedMaterialType for the material_type field
    formData.append('material_type', determinedMaterialType);
    formData.append('title', title);
  
    // Conditionally append 'link_url' and 'notes' based on the selectedOption
    if (selectedOption === 'link') {
      formData.append('link_url', link_url);
    } else if (selectedOption === 'notes') {
      formData.append('notes', notes);
    }
  
    // Append file only if 'file' is selected and a file is chosen
    if (selectedOption === 'file' && file) {
      formData.append('file', file);
    }
  
    const authData = JSON.parse(sessionStorage.getItem('authData'));
    const token = authData ? authData.token : null;
  
    try {
      const response = await fetch('http://localhost:3001/materials/new-material', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      props.onMaterialsUpdated(); // Update the materials list
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Button onClick={onOpen}><AddIcon /></Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody as="form" onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.subject}>
              <FormLabel>Subject:</FormLabel>
              <Select placeholder='Select option' value={subject} onChange={e => setSubject(e.target.value)}>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.subject_name}>{subject.subject_name}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.subject}</FormErrorMessage>
            </FormControl>



            <FormControl isInvalid={errors.title} mt={4}>
              <FormLabel>Title:</FormLabel>
              <Input placeholder='Add title here...' value={title} onChange={e => setTitle(e.target.value)} />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <Text py={10}>Select One:</Text>
            <HStack>
            <RadioGroup onChange={setSelectedOption} value={selectedOption} mt={4}>
              <Stack direction="column" spacing="60px">
                <Radio value="link">URL</Radio>
                <Radio value="notes">Notes</Radio>
                <Radio value="file">Upload</Radio>
              </Stack>
            </RadioGroup>

            <VStack>
              <FormControl mt={4} isDisabled={selectedOption !== 'link'}>

                <Input placeholder='example' value={link_url} onChange={e => setLink_Url(e.target.value)} />
              </FormControl>

              <FormControl mt={4} isDisabled={selectedOption !== 'notes'}>

                <Textarea placeholder='Add notes here...' value={notes} onChange={e => setNotes(e.target.value)} />
              </FormControl>

              <FormControl mt={4} isDisabled={selectedOption !== 'file'}>
                <Input type="file" onChange={handleFileChange} />
              </FormControl>
            </VStack>
            </HStack>


            <ModalFooter mt={4}>
              <Button colorScheme="blue" mr={3} type="submit">
                Submit
              </Button>
              <Button colorScheme='red' onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddMaterial;
