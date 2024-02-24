import { Button, useDisclosure, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, FormErrorMessage, RadioGroup, Stack, Radio, HStack, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';

function AddMaterial({ subjects }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subject, setSubject] = useState('');
  const [material_type, setMaterial_Type] = useState('');
  const [title, setTitle] = useState('');
  const [link_url, setLink_Url] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null); 
  const [selectedOption, setSelectedOption] = useState(''); 
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!subject) newErrors.subject = 'Course is required';
    if (!material_type) newErrors.material_type = 'Material type is required';
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

    const formData = new FormData();
    formData.append('subject_name', subject);
    formData.append('material_type', material_type);
    formData.append('title', title);
    formData.append('link_url', link_url);
    formData.append('notes', notes);
    if (file) formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/materials/new-material', {
        method: 'POST',
        body: formData, // Sending the form data instead of JSON
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

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
              <FormLabel>Course:</FormLabel>
              <Select placeholder='Select option' value={subject} onChange={e => setSubject(e.target.value)}>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.subject_name}>{subject.subject_name}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.subject}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.material_type} mt={4}>
              <FormLabel>Material:</FormLabel>
              <Select placeholder='Select option' value={material_type} onChange={e => setMaterial_Type(e.target.value)}>
                <option value='Text'>Text</option>
                <option value='Document'>Document</option>
                <option value='Link'>Link</option>
                <option value='Image'>Image</option>
              </Select>
              <FormErrorMessage>{errors.material_type}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.title} mt={4}>
              <FormLabel>Title:</FormLabel>
              <Input placeholder='Add title here...' value={title} onChange={e => setTitle(e.target.value)} />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <HStack>
            <RadioGroup onChange={setSelectedOption} value={selectedOption} mt={4}>
              <Stack direction="column" spacing={10}>
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

                <Input placeholder='Add notes here...' value={notes} onChange={e => setNotes(e.target.value)} />
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
