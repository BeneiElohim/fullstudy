import React, { useState } from 'react';
import {
  Button,
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
  useDisclosure,
  Select,
  Textarea
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
  
  function AddAssignment({ subjects, ...props }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState({});
    const [errors, setErrors] = useState({});
  
    const validateForm = () => {
      let newErrors = {};
      if (!title) newErrors.title = 'Title is required';
      if (!dueDate) newErrors.dueDate = 'Due date is required';
      if (!priority) newErrors.priority = 'Priority is required';
      if (!subject) newErrors.subject = 'Subject is required';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
        
      const formattedDueDate = dueDate.replace('T', ' ') + ':00';

      const assignmentData = {
        title,
        due_date: formattedDueDate,
        priority,
        description,
        subject_name: subject
      };
    
      const authData = JSON.parse(sessionStorage.getItem('authData'));
      const token = authData ? authData.token : null;
    
      try {
        const response = await fetch('http://localhost:3001/assignments/new-assignment', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
          body: JSON.stringify(assignmentData),
        });
    
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        props.onAssignmentsUpdate()
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
            <ModalHeader>Add Assignment</ModalHeader>
            <ModalCloseButton />
            <ModalBody as="form" onSubmit={handleSubmit}>
              <FormControl isInvalid={errors.title}>
                <FormLabel>Name:</FormLabel>
                <Input placeholder='Add the assignment name here...' value={title} onChange={e => setTitle(e.target.value)} />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.subject}>
              <FormLabel>Subject:</FormLabel>
              <Select placeholder='Select option' value={subject} onChange={e => setSubject(e.target.value)}>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.subject_name}>{subject.subject_name}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.subject}</FormErrorMessage>
            </FormControl>
                            {/* Due Date Input */}
            <FormControl isInvalid={errors.dueDate}>
            <FormLabel>Due Date:</FormLabel>
            <Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <FormErrorMessage>{errors.dueDate}</FormErrorMessage>
            </FormControl>

            {/* Priority Selector */}
            <FormControl isInvalid={errors.priority}>
            <FormLabel>Priority:</FormLabel>
            <Select placeholder='Select priority' value={priority} onChange={e => setPriority(e.target.value)}>
                <option value='High'>High</option>
                <option value='Medium'>Medium</option>
                <option value='Low'>Low</option>
            </Select>
            <FormErrorMessage>{errors.priority}</FormErrorMessage>
            </FormControl>

            {/* Description Input */}
            <FormControl>
            <FormLabel>Description:</FormLabel>
            <Textarea placeholder='Add a description here...' value={description} onChange={e => setDescription(e.target.value)} />
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
  
  export default AddAssignment;