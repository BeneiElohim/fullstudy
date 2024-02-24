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
  const navigate = useNavigate(); // Hook for navigation

  // Define the onLoginSuccess function
  const onLoginSuccess = (data) => {
    setAuthData(data); // Update auth state with the data from login response
    navigate('/dashboard'); // Redirect to dashboard
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
              <div style={{ marginLeft: '200px' }}> {/* Adjust this value based on the width of your navbar */}
                <Dashboard />
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/materials" element={
          <ProtectedRoute>
            <div style={{ display: 'flex' }}>
              <Navbar />
              <div style={{ marginLeft: '200px' }}> {/* Adjust if necessary */}
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