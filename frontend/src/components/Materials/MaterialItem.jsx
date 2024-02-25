// MaterialItem.jsx
import React from 'react';
import { Button, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';

const MaterialItem = ({ material }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleEdit = () => {
    onEdit(material); // Trigger the edit mode with the current material data
  };

  switch (material.material_type) {
    case 'Link':
      return <Button><Link href={material.link_url} isExternal target='_blank'>{material.title}</Link></Button>
      case 'Document':
        return <Button><a href={`http://localhost:3001/${material.file_path}`} target="_blank" rel="noopener noreferrer">{material.title}</a></Button>
    case 'Text':
      return (
        <Button onClick={onOpen}>{material.title}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Notes</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {material.notes}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Button>
      );
    default:
      return <Button>{material.title}</Button>; // Default case
  }
};

export default MaterialItem;
