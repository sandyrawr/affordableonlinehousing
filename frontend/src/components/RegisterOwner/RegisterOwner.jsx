import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './OwnerSignup.module.css';
import {
  Mail,
  Lock,
  User,
  Phone,
  FileImage,
  Home,
  ShieldCheck,
  DollarSign,
  List,
  Settings,
  UserCheck
} from 'lucide-react';

const RegisterOwner = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'owner',
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
      await axios.post('http://localhost:8000/api/register/owner/', data);
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (err) {
      console.error(err);
      setMessage('Failed to register owner: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.signupContainer}>
        <div className={styles.leftBox}>
          <div className={styles.infoContainer}>
            <h2>Sign Up as Owner</h2>
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <Home className={styles.benefitIcon} />
                <span>List your properties easily</span>
              </div>
              <div className={styles.benefitItem}>
                <UserCheck className={styles.benefitIcon} />
                <span>Screen verified tenants</span>
              </div>
              <div className={styles.benefitItem}>
                <List className={styles.benefitIcon} />
                <span>Track property listings</span>
              </div>
              <div className={styles.benefitItem}>
                <Settings className={styles.benefitIcon} />
                <span>Manage all properties in one place</span>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.rightBox}>
          <div className={styles.formHeader}>
            <h2>Create Your Account</h2>
            <p>Start managing your properties</p>
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
              {loading ? 'Registering...' : 'Register as Owner'}
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

export default RegisterOwner;