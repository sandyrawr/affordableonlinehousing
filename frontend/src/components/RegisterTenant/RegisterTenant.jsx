import React, { useState } from 'react';
import axios from 'axios';
import styles from './RegisterTenant.module.css'; // Import the CSS Module

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
      await axios.post('http://localhost:8000/api/register/tenant/', data);
      alert('Tenant registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Registration failed.');
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

          <div className={styles.inputGroup}>
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
            <input
              name="phone_number"
              type="text"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              name="criminal_history"
              type="checkbox"
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label>Criminal History</label>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              name="employment_status"
              type="checkbox"
              onChange={handleChange}
              className={styles.checkbox}
            />
            <label>Employed</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              name="user_image"
              type="file"
              onChange={handleFileChange}
              className={styles.formControl}
            />
          </div>

          <div className={styles.submitGroup}>
            <button type="submit" className={`${styles.btnSuccess} ${styles.formControl}`}>
              Register as Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTenant;
