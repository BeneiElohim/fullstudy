// In your Login component
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path as necessary
import { FormErrorMessage, FormLabel, Center, Box, Heading, Input, Button, HStack } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState('');
  const { setAuthData } = useAuth(); // Assuming useAuth provides setAuthData

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setAuthData(data); // Set auth data in context
      
      if (keepSignedIn) {
        // Store auth data in localStorage for persistence across sessions
        localStorage.setItem('authData', JSON.stringify(data));
        sessionStorage.setItem('authData', JSON.stringify(data));
      } else {
        // Store auth data in sessionStorage for the current session only
        sessionStorage.setItem('authData', JSON.stringify(data));
      }

      // Redirect to dashboard or perform other actions on successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
<>
<Center w="100%" h="100vh">
  <Box mx="1" maxW="xl" p="9" borderWidth="1px" borderRadius="lg">
    <Heading mb="4" size="lg" textAlign="center">
      Log In
    </Heading>
    <form onSubmit={handleSubmit}>
      <FormLabel htmlFor="email">Email</FormLabel>
      <Input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="user@email.com"
      />
      <FormLabel htmlFor="password">Password</FormLabel>
      <Input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <HStack mt="4">
        <input
          type="checkbox"
          id="keepSignedIn"
          checked={keepSignedIn}
          onChange={(e) => setKeepSignedIn(e.target.checked)}
        />
        <FormLabel htmlFor="keepSignedIn">Keep me signed in</FormLabel>
      </HStack>
      <Button
        mt="4"
        type="submit"
        colorScheme="blue"
        size="md"
        w="full"
        loadingText="Logging In"
      >
        Log In
      </Button>
      <FormErrorMessage>
      {error && <div>{error}</div>}
      </FormErrorMessage>
    </form>
  </Box>
</Center>
</>
  );
};

export default Login;


