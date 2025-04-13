// src/pages/RegisterOwner.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './OwnerSignup.css'; // Import the new CSS
import { useNavigate, Link } from 'react-router-dom';

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
      setFormData({ ...formData, user_image: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'employment_status') {
      setFormData({ ...formData, employment_status: value === 'true' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await axios.post('http://localhost:8000/api/register/user/', {
        email: formData.email,
        password: formData.password,
        role: 'owner'
      });

      const user_Id = userResponse.data.user_id;

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

      const ownerResponse = await axios.post('http://localhost:8000/api/register/owner/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (ownerResponse.status === 201) {
        alert('Owner registered successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error("Error registering owner:", error.response?.data);
      alert('Error registering Owner');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="signup-container">
        <div className="left-box">
          <div className="image-container">
            <img src="/locations/house.png" alt="House" className="signup-image" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="right-box">
          <div className="form-header">
            <h2>Register as Owner</h2>
            <p>Join us and manage your properties with ease!</p>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              name="criminal_history"
              checked={formData.criminal_history}
              onChange={handleChange}
              className="form-check-input"
              id="criminalCheck"
            />
            <label htmlFor="criminalCheck" className="form-check-label">
              Tick if you have a criminal history
            </label>
          </div>

          <label htmlFor="employment_status" className="form-label d-block">Employment Status</label>
          <div className="input-group">
            <select
              name="employment_status"
              value={formData.employment_status.toString()}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Select Employment Status --</option>
              <option value="true">Employed</option>
              <option value="false">Unemployed</option>
            </select>
          </div>

          <div className="input-group">
            <input
              type="file"
              name="user_image"
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="submit-group">
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </div>

          <div className="text-center">
            <small>
              Already have an account? <Link to="/login">Log In</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterOwner;
