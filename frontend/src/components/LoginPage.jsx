// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login/', formData);
      const { role, token } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'owner') {
        navigate('/owner/dashboard');
      } else if (role === 'tenant') {
        navigate('/home');
      } else {
        alert('Invalid role');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        <p><Link to="/">Go Back Home</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;
