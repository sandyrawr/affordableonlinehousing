import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';

const TenantSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    criminal_history: false,
    employment_status: true,
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    if (name === 'employment_status') {
      setFormData(prev => ({
        ...prev,
        employment_status: value === 'true',
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.phone_number) {
      setMessage('❌ Phone number is required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/tenants/register/', formData);
      setMessage('✅ Registration successful!');
      console.log('Success:', response.data);
    } catch (error) {
      const errMsg = error.response?.data || 'Something went wrong';
      console.error('Registration error:', errMsg);
      setMessage(`❌ Registration failed. ${JSON.stringify(errMsg)}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="row p-4 bg-white shadow rounded-4" style={{ width: '90%', maxWidth: '1100px', marginTop: '-60px' }}>
        <div className="col-md-6 d-flex justify-content-center align-items-center flex-column">
          <div className="mb-3">
            <img src="locations/house.png" className="rounded-4" style={{ width: '100%', maxWidth: '395px' }} alt="House" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="col-md-6">
          <div className="mb-4">
            <h2>Sign Up!</h2>
            <p>To start your new journey!</p>
          </div>

          {message && <p className="mb-3 text-sm text-danger">{message}</p>}

          <div className="mb-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Name"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="form-control"
              placeholder="Phone Number"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              name="criminal_history"
              checked={formData.criminal_history}
              onChange={handleChange}
              className="form-check-input"
              id="criminalCheck"
            />
            <label className="form-check-label" htmlFor="criminalCheck">
              Do you have a criminal history?
            </label>
          </div>

          <div className="mb-3">
            <label htmlFor="employment_status" className="form-label">Employment Status</label>
            <select
              name="employment_status"
              value={formData.employment_status.toString()}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="true">Employed</option>
              <option value="false">Unemployed</option>
            </select>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </div>

          <div className="text-center">
            <small>Already have an account? <a href="/login">Log In</a></small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantSignUp;
