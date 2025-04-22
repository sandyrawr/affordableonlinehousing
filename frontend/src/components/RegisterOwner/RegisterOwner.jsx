import React, { useState } from 'react';
import axios from 'axios';
import styles from './OwnerSignup.module.css';
import {
  Mail,
  Lock,
  User,
  Phone,
  FileImage,
  CheckCircle
} from 'lucide-react';

const RegisterOwner = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'owner',
    name: '',
    phone_number: '',
    criminal_history: false,
    employment_status: false,
    user_image: null,
  });

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

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('user.email', formData.email);
    data.append('user.password', formData.password);
    data.append('user.role', formData.role);
    data.append('name', formData.name);
    data.append('phone_number', formData.phone_number);
    data.append('criminal_history', formData.criminal_history);
    data.append('employment_status', formData.employment_status);
    if (formData.user_image) {
      data.append('user_image', formData.user_image);
    }

    try {
      await axios.post('http://localhost:8000/api/register/owner/', data);
      alert('Owner registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.imageContainer}>
          <img src="/locations/house.png" alt="House" className={styles.houseImage} />
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>
          <h2 className={styles.title}>Register as Owner</h2>

          <div className={styles.inputGroup}>
            <Mail className={styles.icon} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className={styles.input}
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
              className={styles.input}
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
              className={styles.input}
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
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxGroup}>
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
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterOwner;
