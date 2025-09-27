import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password_hash: password });
      localStorage.setItem('userId', response.data.id);
      window.location.href = '/';
    } catch (err) {
      setError('Error: ' + (err.response?.data || 'Login failed'));
    }
  };

  return (
    <div className="App">
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
