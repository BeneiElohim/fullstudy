// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, Text, Button, Drawer, DrawerBody, DrawerFooter, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { ImBooks } from "react-icons/im";
import { IoSettingsSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";


const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logout = () => {
    console.log('Logging out...'); // Debugging line
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Hamburger Icon for mobile screens */}
      <Button variant="outline" onClick={onOpen} display={{ base: 'block', md: 'none' }} m={2} position="fixed" zIndex="overlay">
        <HamburgerIcon />
      </Button>

      {/* Sidebar for larger screens */}
      <Box display={{ base: 'none', md: 'block' }} position="fixed" height="100vh" bg="blue.500" color="white" padding={4}>
        <VStack spacing={4}>
          <Text fontSize="2xl">StudyTracker</Text>
          <Link to="/dashboard"><Button variant="ghost" _hover={{ color: 'blue.300' }}><MdDashboard size={50} />Dashboard</Button></Link>
          <Link to="/materials"><Button variant="ghost" _hover={{ color: 'blue.300' }}><ImBooks size={50} />Materials</Button></Link>
          <Button style={{ position: "fixed", bottom: "100px" }} variant="ghost" _hover={{ color: 'blue.300' }}><IoSettingsSharp size={30} /></Button>
          <Button onClick={logout} style={{ position: "fixed", bottom: "50px" }} variant="ghost" _hover={{ color: 'blue.300' }}><TbLogout2  size={30} />Logout</Button>
        </VStack>
      </Box>

      {/* Drawer for smaller screens */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="blue.500" color="white">
          <DrawerCloseButton />
          <VStack spacing={4} m={4}>
            <Text fontSize="2xl">StudyTracker</Text>
            <Link to="/dashboard"><Button variant="ghost"  justifyContent="flex-start" pr="95px" pl="95px" onClick={onClose}><MdDashboard size={24} />Dashboard</Button></Link>
            <Link to="/materials"><Button variant="ghost" justifyContent="flex-start" pr="100px" pl="100px" onClick={onClose}><ImBooks size={24} />Materials</Button></Link>
            <Button variant="ghost" w="full" justifyContent="center" onClick={onClose}><IoSettingsSharp size={24} />Settings</Button>
            <Button onClick={() => { logout(); onClose(); }} variant="ghost" w="full" justifyContent="center"><TbLogout2 size={24} />Logout</Button>
          </VStack>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Navbar;