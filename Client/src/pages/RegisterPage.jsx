import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/authService';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 340, margin: '40px auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text" placeholder="Full Name" value={name}
          onChange={e => setName(e.target.value)} required
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <input
          type="email" placeholder="Email" value={email}
          onChange={e => setEmail(e.target.value)} required
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required
          style={{ display: 'block', width: '100%', marginBottom: 10 }}
        />
        <button type="submit" style={{ width: '100%' }}>Register</button>
        {errorMsg && <div style={{ color: 'red', marginTop: 8 }}>{errorMsg}</div>}
      </form>
    </div>
  );
}
