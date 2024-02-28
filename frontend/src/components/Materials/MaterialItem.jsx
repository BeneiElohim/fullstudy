// MaterialItem.jsx
import React from 'react';
import { Button, Link, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, HStack } from '@chakra-ui/react';

const MaterialItem = ({ material, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();


  switch (material.material_type) {
    case 'Link':
      return (
        <HStack>
          <Button><Link href={material.link_url} isExternal target='_blank'>{material.title}</Link></Button>
        </HStack>
      ) 
      case 'Document':
        return (
          <HStack>
            <Button><a href={`http://localhost:3001/${material.file_path}`} target="_blank" rel="noopener noreferrer">{material.title}</a></Button>
          </HStack>
        )
    case 'Text':
      return (
        <HStack>
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
        </HStack>
      );
    default:
      return <Button>{material.title}</Button>; // Default case
  }
};

export default MaterialItem;
