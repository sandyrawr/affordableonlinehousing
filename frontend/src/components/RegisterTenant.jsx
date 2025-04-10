import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterOwner() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone_number: '',
    criminal_history: false,
    employment_status: false,
    user_image: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        user_image: files[0]
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'employment_status') {
      setFormData({
        ...formData,
        employment_status: value === 'true'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Register user and get the user_id
      const userResponse = await axios.post('http://localhost:8000/api/register/user/', {
        email: formData.email,
        password: formData.password,
        role: 'tenant'
      });

      const user_Id = userResponse.data.user_id;

      // Step 2: Submit owner details with the user_id
      const form = new FormData();
      form.append('user_id', user_Id);
      form.append('user', user_Id);
      form.append('name', formData.name);
      form.append('phone_number', formData.phone_number);
      form.append('criminal_history', formData.criminal_history);
      form.append('employment_status', formData.employment_status);
      if (formData.user_image) {
        form.append('user_image', formData.user_image);
      }

      const ownerResponse = await axios.post('http://localhost:8000/api/register/tenant/', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (ownerResponse.status === 201) {
        alert('Owner registered successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error("Error registering owner:", error.response.data);
      alert('Error registering Owner');
    }
  };

  return (
    <div className="container">
      <h2>Register as Tenant</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="criminal_history"
            checked={formData.criminal_history}
            onChange={handleChange}
          />{' '}
          Do you have a criminal history?
        </label>

        <label>
          Employment Status:
          <select
            name="employment_status"
            value={formData.employment_status}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Employment Status --</option>
            <option value="true">Employed</option>
            <option value="false">Unemployed</option>
          </select>
        </label>

        <input
          type="file"
          name="user_image"
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterOwner;
