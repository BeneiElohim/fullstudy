//frontend/src/App.jsx
import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth} from './context/AuthContext.jsx';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar.jsx';
import { Box , useBreakpointValue } from '@chakra-ui/react';
import Materials from './components/Materials/Materials.jsx'; 


const App = () => {
  const { authData, setAuthData } = useAuth();
  const navigate = useNavigate(); 

  const onLoginSuccess = (data) => {
    setAuthData(data); 
    navigate('/dashboard');
  };

  const onRegisterSuccess = (data) => {
    setAuthData(data);
    navigate('/dashboard');
  }
  
  const marginLeft = useBreakpointValue({ base: '50px', md: '200px' }); 

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={!authData ? <Login onLoginSuccess={onLoginSuccess}/> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!authData ? <Register onRegisterSuccess={onRegisterSuccess}/> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Box display="flex">
              <Navbar />
              <Box marginLeft={marginLeft}>
                <Dashboard />
              </Box>
            </Box>
          </ProtectedRoute>
        } />
        <Route path="/materials" element={
          <ProtectedRoute>
            <Box display="flex">
              <Navbar />
              <Box marginLeft={marginLeft}>
                <Materials />
              </Box>
            </Box>
          </ProtectedRoute>
        } />
      </Routes>
  );
};

export default App;