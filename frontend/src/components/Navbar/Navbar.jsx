// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Box, VStack, Text, Button } from '@chakra-ui/react';
import { ImBooks } from "react-icons/im";
import { IoSettingsSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { TbMathSymbols } from "react-icons/tb";


const Navbar = () => {

  const logout = () => {
    console.log('Logging out...'); // Debugging line
    localStorage.removeItem('authData');
    sessionStorage.removeItem('authData');
    window.location.href = '/login';
  };

  return (
    <Box position="fixed" height="100vh" bg="blue.500" color="white" padding={4}>
      <VStack spacing={4}>
        <Text fontSize="2xl">StudyTracker</Text>
        <Link to="/dashboard"><Button variant="ghost" _hover={{ color: 'blue.300' }}><MdDashboard size={50} />Dashboard</Button></Link>
        <Link to="/materials"><Button variant="ghost" _hover={{ color: 'blue.300' }}><ImBooks size={50} />Subjects</Button></Link>
        <Link to="/materials"><Button variant="ghost" _hover={{ color: 'blue.300' }}><ImBooks size={50} />Materials</Button></Link>

        <Button style={{ position: "fixed", bottom: "100px", left: "50px" }} variant="ghost" _hover={{ color: 'blue.300' }}><IoSettingsSharp size={30} /></Button>
        <Button onClick={logout} style={{ position: "fixed", bottom: "50px", left: "30px" }} variant="ghost" _hover={{ color: 'blue.300' }}><TbLogout2  size={30} />Logout</Button>
      </VStack>
    </Box>
  );
}
export default Navbar;
