import React, { useState } from 'react';
import axios from 'axios';
import styles from './login.module.css';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login/', formData);
      const { access, refresh, user_id, role } = res.data;
  
      const userData = {
        accessToken: access,
        refreshToken: refresh,
        userId: user_id,
        role: role,
      };
  
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
  
      if (role === 'admin') {
        navigate('/adminpage');
      } else if (role === 'owner') {
        navigate('/profile');
      } else if (role === 'tenant') {
        navigate('/home');
      } else {
        alert('Invalid role');
      }
    } catch (error) {
      console.error('Login failed:', error);
  
      if (error.response && error.response.status === 403) {
        // Redirect to email verification page
        navigate('/verify-email', { state: { email: formData.email } });
      } else if (error.response && error.response.data && error.response.data.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else if (error.response && error.response.data && typeof error.response.data === 'string') {
        setError(error.response.data);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.leftBox}>
          <div className={styles.imageContainer}>
            <img src="/locations/house.png" alt="House" className={styles.signupImage} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.rightBox}>
          <div className={styles.formHeader}>
            <h2>Log In</h2>
            <p>Welcome back! Please log in to continue.</p>
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formControl}
              placeholder="Email Address"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formControl}
              placeholder="Password"
              required
            />
          </div>

          <div className={styles.submitGroup}>
            <button type="submit" className={styles.btnSucess}>
              Log In
            </button>
          </div>

          <div className={styles.textCenter}>
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
