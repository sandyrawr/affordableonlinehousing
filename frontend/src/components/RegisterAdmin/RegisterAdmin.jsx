import React, { useState } from 'react';
import axios from 'axios';

const RegisterAdmin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('user.email', formData.email);
    data.append('user.password', formData.password);
    data.append('user.role', formData.role);

    try {
      await axios.post('http://localhost:8000/api/register/admin/', data);
      alert('Admin registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register as Admin</h2>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterAdmin;
