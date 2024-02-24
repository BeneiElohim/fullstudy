// In your Login component
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path as necessary

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="checkbox"
            id="keepSignedIn"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
          />
          <label htmlFor="keepSignedIn">Keep me signed in</label>
        </div>
        <button type="submit">Login</button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
};

export default Login;
