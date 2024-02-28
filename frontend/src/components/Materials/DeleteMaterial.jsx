import React from 'react';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import { FaTrashAlt } from "react-icons/fa";

const DeleteMaterial = ({ materialId, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDelete = async(e) => {
    e.preventDefault();

    const authData = JSON.parse(sessionStorage.getItem('authData'));
    const token = authData ? authData.token : null;
  
    try {
      const response = await fetch(`http://localhost:3001/materials/delete-material/${materialId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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
      <Button colorScheme="red" onClick={onOpen}><FaTrashAlt /></Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Material</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this material?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>Delete</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteMaterial;