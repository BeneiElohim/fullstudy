//frontend/src/App.jsx
import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth} from './context/AuthContext.jsx';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar.jsx';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import Materials from './components/Materials/Materials.jsx'; 


const App = () => {
  const { authData, setAuthData } = useAuth();
  const navigate = useNavigate(); 

  const onLoginSuccess = (data) => {
    setAuthData(data); 
    navigate('/dashboard');
  };

  return (
    <ChakraProvider>
      <Routes>
        <Route path="/login" element={!authData ? <Login onLoginSuccess={onLoginSuccess}/> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!authData ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div style={{ display: 'flex' }}>
              <Navbar />
              <div style={{ marginLeft: '200px' }}>
                <Dashboard />
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/materials" element={
          <ProtectedRoute>
            <div style={{ display: 'flex' }}>
              <Navbar />
              <div style={{ marginLeft: '200px' }}>
                <Materials />
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </ChakraProvider>
  );
};

export default App;