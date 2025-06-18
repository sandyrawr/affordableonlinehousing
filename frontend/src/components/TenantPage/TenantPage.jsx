import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TenantPage.module.css';
import { Save, Trash2 } from 'lucide-react';

const TenantPage = () => {
  const [tenantData, setTenantData] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    axios.get('http://localhost:8000/tenant-profile/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setTenantData(res.data);
        setFormData({
          ...res.data,
          email: res.data.user?.email || '',
          password: '',
          new_password: ''
        });
        setImagePreview(res.data.user_image);
      })
      .catch(err => console.error('Error fetching tenant data:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, user_image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem('accessToken');
    const form = new FormData();

    const isImageFile = formData.user_image instanceof File;
    const hasProfileChanged = isImageFile || (
      formData.user_image &&
      tenantData.user_image &&
      formData.user_image !== tenantData.user_image
    );

    const changed =
      formData.name !== tenantData.name ||
      formData.phone_number !== tenantData.phone_number ||
      formData.email !== tenantData.user?.email ||
      formData.employment_status !== tenantData.employment_status ||
      formData.criminal_history !== tenantData.criminal_history ||
      hasProfileChanged ||
      formData.new_password;

    if (!changed) {
      setMessage('No changes found.');
      return;
    }

    // Append fields to FormData
    form.append('name', formData.name);
    form.append('phone_number', formData.phone_number);
    form.append('employment_status', formData.employment_status);
    form.append('criminal_history', formData.criminal_history);
    form.append('email', formData.email);

    if (formData.user_image && typeof formData.user_image !== 'string') {
      form.append('user_image', formData.user_image);
    }

    if (formData.password) {
      form.append('password', formData.password);
    }

    if (formData.new_password) {
      form.append('new_password', formData.new_password);
    }

    axios.patch('http://localhost:8000/tenant-profile/', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => {
        setMessage('Changes saved successfully.');
        setTenantData(res.data);
        setFormData(prev => ({
          ...prev,
          password: '',
          new_password: ''
        }));
      })
      .catch(err => {
        console.error('Error saving changes:', err);
        setMessage(err.response?.data?.password?.[0] || 'Failed to update profile.');
      });
  };

  const handleDeleteAccount = () => {
    const token = localStorage.getItem('accessToken');
    axios.delete('http://localhost:8000/tenant-profile/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        localStorage.clear();
        window.location.href = '/login';
      })
      .catch(err => console.error('Error deleting account:', err));
  };

  return (
    <div className={styles.tenantPageContainer}>
      <h2 className={styles.title}>Tenant Profile</h2>
      {message && <p className={styles.message}>{message}</p>}
      {tenantData && (
        <div className={styles.profileCard}>
          <div className={styles.imageWrapper}>
            <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
              <img
                src={imagePreview}
                alt="Tenant"
                className={styles.profileImage}
              />
            </label>
            <input id="imageUpload" type="file" hidden onChange={handleImageChange} />
          </div>

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <label>Current Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <label>New Password:</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password || ''}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={handleChange}
            className="form-control mb-2"
          />

          <label>Employment Status:</label>
          <input
            type="checkbox"
            name="employment_status"
            checked={formData.employment_status || false}
            onChange={handleChange}
            className="form-check-input mb-2"
          /> Employed
          <br />

          <label>Criminal History:</label>
          <input
            type="checkbox"
            name="criminal_history"
            checked={formData.criminal_history || false}
            onChange={handleChange}
            className="form-check-input mb-2"
          /> Has Criminal Record

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-success" onClick={handleSaveChanges}>
              <Save size={16} className="me-1" /> Save Changes
            </button>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              <Trash2 size={16} className="me-1" /> Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantPage;
