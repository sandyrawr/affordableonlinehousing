import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Reusing the same styles as Signup
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
      const { access, refresh, user_id, role, owner_id } = res.data;

      const userData = {
        accessToken: access,
        refreshToken: refresh,
        userId: user_id,
        role: role,
        ownerId: owner_id
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      if (role === 'admin') {
        navigate('/addlocation');
      } else if (role === 'owner') {
        navigate('/profile');
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
    <div className='page-wrapper'>
      <div className="signup-container">
        <div className="left-box">
          <div className="image-container">
            <img src="/locations/house.png" alt="House" className="signup-image" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="right-box">
          <div className="form-header">
            <h2>Log In</h2>
            <p>Welcome back! Please log in to continue.</p>
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
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          <div className="submit-group">
            <button type="submit" className="btn btn-success w-100">
              Log In
            </button>
          </div>

          <div className="text-center">
            <small>
              Don’t have an account? <Link to="/startregister">Sign Up</Link>
            </small>
            <br />
            <small>
              <Link to="/">Go Back Home</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
