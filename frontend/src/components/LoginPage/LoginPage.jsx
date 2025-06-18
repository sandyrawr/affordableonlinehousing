import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Home } from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
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
        navigate('/verify-email', { state: { email: formData.email } });
      } else if (error.response && error.response.data && error.response.data.non_field_errors) {
        setError(error.response.data.non_field_errors[0]);
      } else if (error.response && error.response.data && typeof error.response.data === 'string') {
        setError(error.response.data);
      } else if (error.response && error.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.leftBox}>
          <div className={styles.imageContainer}>
            <Home className={styles.houseIcon} size={48} />
            <h2 className={styles.welcomeText}>Welcome to Rentable</h2>
            <p className={styles.tagline}>Your perfect home is waiting</p>
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
            <Mail className={styles.inputIcon} size={18} />
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
            <Lock className={styles.inputIcon} size={18} />
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
            <button 
              type="submit" 
              className={styles.btnSuccess}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.linkItem}>
              <Link to="/startregister">Don't have an account? Sign Up</Link>
            </div>
            <div className={styles.linkItem}>
              <Link to="/">Go Back Home</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;