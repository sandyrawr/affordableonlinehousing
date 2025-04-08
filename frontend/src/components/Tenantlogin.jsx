import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Signup.css';

const TenantLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage('❌ Both email and password are required!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/tenants/login/', formData);
      setMessage('✅ Login successful!');
      console.log('Success:', response.data);
    } catch (error) {
      const errMsg = error.response?.data || 'Something went wrong';
      console.error('Login error:', errMsg);
      setMessage(`❌ Login failed. ${JSON.stringify(errMsg)}`);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-image-section">
          <img src="locations/house.png" className="rounded-4" alt="House" />
        </div>

        <form onSubmit={handleSubmit} className="signup-form-section">
          <div className="mb-4">
            <h2>Log In</h2>
            <p>Welcome back! Please login to continue.</p>
          </div>

          {message && <p className="mb-3 text-sm text-danger">{message}</p>}

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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-success w-100">
              Log In
            </button>
          </div>

          <div className="text-center">
            <small>Don't have an account? <Link to="/signup">Sign Up</Link></small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantLogin;
