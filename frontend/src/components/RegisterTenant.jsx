// RegisterTenant.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RegisterTenant = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'tenant',
    name: '',
    phone_number: '',
    criminal_history: false,
    employment_status: false,
    user_image: null,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = e => {
    setFormData({ ...formData, user_image: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('user.email', formData.email);
    data.append('user.password', formData.password);
    data.append('user.role', formData.role);
    data.append('name', formData.name);
    data.append('phone_number', formData.phone_number);
    data.append('criminal_history', formData.criminal_history);
    data.append('employment_status', formData.employment_status);
    if (formData.user_image) {
      data.append('user_image', formData.user_image);
    }

    try {
      await axios.post('http://localhost:8000/api/register/tenant/', data);
      alert('Tenant registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <input name="name" type="text" placeholder="Full Name" onChange={handleChange} required />
      <input name="phone_number" type="text" placeholder="Phone Number" onChange={handleChange} required />
      <label>
        <input name="criminal_history" type="checkbox" onChange={handleChange} /> Criminal History
      </label>
      <label>
        <input name="employment_status" type="checkbox" onChange={handleChange} /> Employed
      </label>
      <input name="user_image" type="file" onChange={handleFileChange} />
      <button type="submit">Register as Tenant</button>
    </form>
  );
};

export default RegisterTenant;
