import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Register user and get the user_id
      const userResponse = await axios.post('http://localhost:8000/api/register/user/', {
        email: formData.email,
        password: formData.password,
        role: 'admin'
      });

      const user_Id = userResponse.data.user_id;

      

      // Step 2: Register Admin with the obtained user_id
      const adminResponse = await axios.post('http://localhost:8000/api/register/admin/', {
        user_id: user_Id,
        user: user_Id

      });

      if (adminResponse.status === 201) {
        alert('Admin registered successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error registering Admin:', error.response?.data || error.message);
      alert('Failed to register Admin. Please check your input.');
    }
  };

  return (
    <div className="container">
      <h2>Register as Admin</h2>
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterAdmin;
