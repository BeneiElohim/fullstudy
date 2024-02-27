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
 } from '@chakra-ui/react';
  import React, { useState } from 'react';
  import { AddIcon } from '@chakra-ui/icons';
  
  function AddSubject(props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [subject, setSubject] = useState('');
    const [errors, setErrors] = useState({});
  
    const validateForm = () => {
      let newErrors = {};
      if (!subject) newErrors.subject = 'Subject is required';

  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
    
      const formData = new FormData();
      formData.append('subject_name', subject);
    
      const authData = JSON.parse(sessionStorage.getItem('authData'));
      const token = authData ? authData.token : null;
    
      try {
        const response = await fetch('http://localhost:3001/subjects/new-subject', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        props.onSubjectsUpdate()
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
            <ModalHeader>Add Subject</ModalHeader>
            <ModalCloseButton />
            <ModalBody as="form" onSubmit={handleSubmit}>
              <FormControl isInvalid={errors.subject}>
                <FormLabel>Subject:</FormLabel>
                <Input placeholder='Add subject here...' value={subject} onChange={e => setSubject(e.target.value)} />
                <FormErrorMessage>{errors.subject}</FormErrorMessage>
              </FormControl>
  
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
  
  export default AddSubject;