// MaterialItem.jsx
import React from 'react';
import {
  Button,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  HStack
} from '@chakra-ui/react';

const MaterialItem = ({ material, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack spacing={4}>
      {(() => {
        switch (material.material_type) {
          case 'Link':
            return (
              <>
                <Button as={Link} href={material.link_url} isExternal>
                  {material.title}
                </Button>
                <Button colorScheme="red" onClick={() => onDelete(material.id)}>
                  Delete
                </Button>
              </>
            );
          case 'Document':
            return (
              <>
                <Button as="a" href={`http://localhost:3001/${material.file_path}`} target="_blank" rel="noopener noreferrer">
                  {material.title}
                </Button>
                <Button colorScheme="red" onClick={() => onDelete(material.id)}>
                  Delete
                </Button>
              </>
            );
          case 'Text':
            return (
              <>
                <Button onClick={onOpen}>
                  {material.title}
                </Button>
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
                <Button colorScheme="red" onClick={() => onDelete(material.id)}>
                  Delete
                </Button>
              </>
            );
          default:
            return (
              <>
                <Button>{material.title}</Button>
                <Button colorScheme="red" onClick={() => onDelete(material.id)}>
                  Delete
                </Button>
              </>
            );
        }
      })()}
    </HStack>
  );
};

export default MaterialItem;
