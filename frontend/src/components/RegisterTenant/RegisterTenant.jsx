import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterTenant.module.css';
import {
  Mail,
  Lock,
  User,
  Phone,
  FileImage,
  CheckCircle,
} from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('role', formData.role);
    data.append('name', formData.name);
    data.append('phone_number', formData.phone_number);
    data.append('criminal_history', formData.criminal_history);
    data.append('employment_status', formData.employment_status);
    if (formData.user_image) {
      data.append('user_image', formData.user_image);
    }
  
    try {
      // Send tenant data to the backend to register the tenant and send OTP
      await axios.post('http://localhost:8000/api/register/tenant/', data);
  
      // Redirect to the email verification page
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      console.error(err);
      setMessage('Failed to register tenant: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.signupContainer}>
        <div className={styles.leftBox}>
          <div className={styles.imageContainer}>
            <img src="/locations/house.png" alt="House" className={styles.signupImage} />
          </div>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.rightBox}>
          <div className={styles.formHeader}>
            <h2>Tenant Sign Up</h2>
            <p>Create your account as a tenant.</p>
          </div>

          {message && (
            <div className={message.includes('success') ? styles.successMessage : styles.errorMessage}>
              {message}
            </div>
          )}

          <div className={styles.inputGroup}>
            <Mail className={styles.icon} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.inputGroup}>
            <User className={styles.icon} />
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.inputGroup}>
            <Phone className={styles.icon} />
            <input
              name="phone_number"
              type="text"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.checkboxWrapper}>
            <label className={styles.checkboxLabel}>
              <input
                name="criminal_history"
                type="checkbox"
                onChange={handleChange}
                className={styles.checkbox}
              />
              <CheckCircle size={16} className={styles.checkIcon} />
              Criminal History
            </label>

            <label className={styles.checkboxLabel}>
              <input
                name="employment_status"
                type="checkbox"
                onChange={handleChange}
                className={styles.checkbox}
              />
              <CheckCircle size={16} className={styles.checkIcon} />
              Employed
            </label>
          </div>

          <div className={styles.inputGroup}>
            <FileImage className={styles.icon} />
            <input
              name="user_image"
              type="file"
              onChange={handleFileChange}
              className={styles.formControl}
            />
          </div>

          <div className={styles.submitGroup}>
            <button 
              type="submit" 
              className={`${styles.btnSuccess} ${styles.formControl}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTenant;