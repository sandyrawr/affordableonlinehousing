import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './RegisterTenant.module.css';
import {
  Mail,
  Lock,
  User,
  Phone,
  FileImage,
  ShieldCheck,
  Search,
  Heart,
  Bell,
  MessageSquare,
  Clock
} from 'lucide-react';

const RegisterTenant = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'tenant',
    name: '',
    phone_number: '',
    criminal_history: null,
    employment_status: null,
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
      await axios.post('http://localhost:8000/api/register/tenant/', data);
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
          <div className={styles.infoContainer}>
            <h2>Sign Up as Tenant</h2>
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <Search className={styles.benefitIcon} />
                <span>Find your perfect home</span>
              </div>
              <div className={styles.benefitItem}>
                <ShieldCheck className={styles.benefitIcon} />
                <span>Verified property owners</span>
              </div>
              <div className={styles.benefitItem}>
                <Heart className={styles.benefitIcon} />
                <span>Save favorite properties</span>
              </div>
              <div className={styles.benefitItem}>
                <Bell className={styles.benefitIcon} />
                <span>Get alerts for new listings</span>
              </div>
              <div className={styles.benefitItem}>
                <MessageSquare className={styles.benefitIcon} />
                <span>Direct communication</span>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.rightBox}>
          <div className={styles.formHeader}>
            <h2>Create Your Account</h2>
            <p>Find your perfect home</p>
          </div>

          <div className={styles.photoUpload}>
            <div className={styles.photoContainer}>
              <input
                type="file"
                id="user_image"
                name="user_image"
                onChange={handleFileChange}
                className={styles.fileInput}
                accept="image/*"
              />
              <label htmlFor="user_image" className={styles.photoCircle}>
                {formData.user_image ? (
                  <img 
                    src={URL.createObjectURL(formData.user_image)} 
                    alt="Preview" 
                    className={styles.photoPreview}
                  />
                ) : (
                  <FileImage className={styles.photoIcon} />
                )}
              </label>
            </div>
          </div>

          {message && (
            <div className={message.includes('success') ? styles.successMessage : styles.errorMessage}>
              {message}
            </div>
          )}

          <div className={styles.inputGroup}>
            <Mail className={styles.icon} size={18} />
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
            <Lock className={styles.icon} size={18} />
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
            <User className={styles.icon} size={18} />
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
            <Phone className={styles.icon} size={18} />
            <input
              name="phone_number"
              type="text"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.selectGroup}>
            <select 
              name="criminal_history" 
              onChange={handleChange}
              className={styles.formControl}
              required
            >
              <option value="">Criminal History</option>
              <option value="true">Has Criminal History</option>
              <option value="false">No Criminal History</option>
            </select>
          </div>

          <div className={styles.selectGroup}>
            <select 
              name="employment_status" 
              onChange={handleChange}
              className={styles.formControl}
              required
            >
              <option value="">Employment Status</option>
              <option value="true">Employed</option>
              <option value="false">Unemployed</option>
            </select>
          </div>

          <div className={styles.submitGroup}>
            <button 
              type="submit" 
              className={`${styles.btnSuccess} ${styles.formControl}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register as Tenant'}
            </button>
            <div className={styles.loginLink}>
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTenant;