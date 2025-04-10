import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'employment_status') {
      setFormData((prev) => ({
        ...prev,
        employment_status: value === 'true',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
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
    <div className='page-wrapper'>
      <div className="signup-container">
        <div className="left-box">
          <div className="image-container">
            <img src="locations/house.png" alt="House" className="signup-image" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="right-box">
          <div className="form-header">
            <h2>Sign Up!</h2>
            <p>To start your new journey!</p>
          </div>

          {message && <p className="message text-danger">{message}</p>}

          <div className="input-group">
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

          <div className="input-group">
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

          <div className="input-group">
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

          <div className="input-group">
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
              Tick mark if you have a criminal history
            </label>
          </div>

          <label htmlFor="employment_status" className="form-label d-block">Employment Status</label>

          <div className="input-group">
            <select
              id="employment_status"
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


          <div className="submit-group">
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </div>

          <div className="text-center">
            <small>
            Already have an account? <Link to="/tenant-login">Log In</Link> {/* Use Link for navigation */}
            </small>
          </div>
        </form>
    </div>
    </div>
  );
};

export default TenantSignUp;
