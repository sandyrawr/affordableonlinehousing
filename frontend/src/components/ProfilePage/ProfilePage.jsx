import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddProperty from '../AddProperty/AddProperty';
import MyProperties from '../MyProperties/MyProperties';
import Bookings from '../Bookings/Bookings';
import TourRequests from '../TourRequests/TourRequests';
import MyRentedSpaces from '../MyRentedSpace/MyRentedSpaces';
import styles from './ProfilePage.module.css';
import axios from 'axios';
import { Save, Trash2, User, Home, Key, LogOut, Plus,Mail, List, LockKeyhole, Phone, DoorOpen, Building } from 'lucide-react';

function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [ownerData, setOwnerData] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (activeSection === 'profile') {
      const token = localStorage.getItem('accessToken');
      axios.get('http://localhost:8000/owner-profile/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setOwnerData(res.data);
          setFormData({
            ...res.data,
            email: res.data.user?.email || '',
            password: '',
            new_password: ''
          });
          setImagePreview(res.data.user_image);
        })
        .catch(err => console.error('Error fetching owner data:', err));
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection === 'logout') {
      localStorage.clear();
      window.location.href = '/login';
    }
  }, [activeSection]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    const hasImageChanged = isImageFile || (
      formData.user_image &&
      ownerData.user_image &&
      formData.user_image !== ownerData.user_image
    );

    const hasChanges =
    formData.name !== ownerData.name ||
    formData.phone_number !== ownerData.phone_number ||
    formData.email !== ownerData.user?.email ||
    formData.employment_status !== ownerData.employment_status ||
    formData.criminal_history !== ownerData.criminal_history ||
    hasImageChanged ||
    formData.new_password;

    if (!hasChanges) {
      setMessage('No changes to update.');
      return;
    }

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

    axios.patch('http://localhost:8000/owner-profile/', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(res => {
        setMessage('Changes saved successfully.');
        setOwnerData(res.data);
        setFormData(prev => ({
          ...prev,
          password: '',
          new_password: ''
        }));
      })
      .catch(err => {
        setMessage('Password incorrect');
        console.error('Error saving changes:', err);
        setMessage(err.response?.data?.password?.[0] || 'Failed to update profile.');
      });
  };

  const handleDeleteAccount = () => {
    const token = localStorage.getItem('accessToken');
    axios.delete('http://localhost:8000/owner-profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        localStorage.clear();
        window.location.href = '/login';
      })
      .catch(err => console.error('Error deleting account:', err));
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1>RENTABLE</h1>
        </div>
        <ul className={styles.sidebarMenu}>
          <li>
            <button 
              onClick={() => setActiveSection('profile')}
              className={`${styles.sidebarButton} ${activeSection === 'profile' ? styles.active : ''}`}
            >
              <User className={styles.buttonIcon} /> Profile
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('addproperty')}
              className={`${styles.sidebarButton} ${activeSection === 'addproperty' ? styles.active : ''}`}
            >
              <Plus className={styles.buttonIcon} /> Add Property
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('myProperties')}
              className={`${styles.sidebarButton} ${activeSection === 'myProperties' ? styles.active : ''}`}
            >
              <Home className={styles.buttonIcon} /> My Properties
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('tourRequests')}
              className={`${styles.sidebarButton} ${activeSection === 'tourRequests' ? styles.active : ''}`}
            >
              <List className={styles.buttonIcon} /> Tour Requests
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('bookingRequests')}
              className={`${styles.sidebarButton} ${activeSection === 'bookingRequests' ? styles.active : ''}`}
            >
              <List className={styles.buttonIcon} /> Booking Requests
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('myrentedspaces')}
              className={`${styles.sidebarButton} ${activeSection === 'myrentedspaces' ? styles.active : ''}`}
            >
              <Building className={styles.buttonIcon} /> My Rented Spaces
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveSection('logout')}
              className={`${styles.sidebarButton} ${activeSection === 'logout' ? styles.active : ''}`}
            >
              <LogOut className={styles.buttonIcon} /> Log Out
            </button>
          </li>
        </ul>
      </div>

      <div className={styles.mainContent}>
        <Routes>
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/tour-requests" element={<TourRequests />} />
          <Route path="/booking-requests" element={<Bookings />} />
          <Route path="/my-rented-spaces" element={<MyRentedSpaces />} />
        </Routes>

        {activeSection === 'profile' && (
          <div className={styles.profileSection}>
            <h2>Welcome to your profile!</h2>
            {message && <p className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>{message}</p>}
            {ownerData && (
              <div className={styles.profileFormContainer}>
                <div className={styles.profileForm}>
                  <div className={styles.leftColumn}>
                    <div className={styles.profileImageContainer}>
                      <label htmlFor="imageUpload" className={styles.imageUploadLabel}>
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className={styles.profileImage}
                        />
                      </label>
                      <input id="imageUpload" type="file" hidden onChange={handleImageChange} />
                      <label htmlFor="imageUpload" className={styles.changePhotoText}>
                        Click to change photo
                      </label>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Name</label>
                      <div className={styles.inputWithIcon}>
                        <User className={styles.inputIcon} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <div className={styles.inputWithIcon}>
                        <Phone className={styles.inputIcon} /> {/* 👈 replaces the SVG */}
                        <input
                          type="text"
                          name="phone_number"
                          value={formData.phone_number || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.rightColumn}>
                  <div className={styles.formGroup}>
                      <label>Email</label>
                      <div className={styles.inputWithIcon}>
                        <Mail className={styles.inputIcon} size={20} strokeWidth={1.5} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Current Password</label>
                      <div className={styles.inputWithIcon}>
                        <LockKeyhole className={styles.inputIcon} />
                        <input
                          type="password"
                          name="password"
                          value={formData.password || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>New Password</label>
                      <div className={styles.inputWithIcon}>
                        <LockKeyhole className={styles.inputIcon} />
                        <input
                          type="password"
                          name="new_password"
                          value={formData.new_password || ''}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Employment Status</label>
                      <select
                        name="employment_status"
                        value={formData.employment_status ? 'true' : 'false'}
                        onChange={(e) => handleChange({ target: { name: 'employment_status', value: e.target.value === 'true' } })}
                      >
                        <option value="true">Employed</option>
                        <option value="false">Unemployed</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Criminal History</label>
                      <select
                        name="criminal_history"
                        value={formData.criminal_history ? 'true' : 'false'}
                        onChange={(e) => handleChange({ target: { name: 'criminal_history', value: e.target.value === 'true' } })}
                      >
                        <option value="true">Committed Felony</option>
                        <option value="false">Not Committed Felony</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <button 
                    onClick={handleSaveChanges}
                    className={styles.saveButton}
                  >
                    <Save className={styles.buttonIcon} /> Save Changes
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className={styles.deleteButton}
                  >
                    <Trash2 className={styles.buttonIcon} /> Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'addproperty' && <AddProperty />}
        {activeSection === 'myProperties' && <MyProperties />}
        {activeSection === 'tourRequests' && <TourRequests />}
        {activeSection === 'bookingRequests' && <Bookings />}
        {activeSection === 'myrentedspaces' && <MyRentedSpaces />}
        {activeSection === 'logout' && <div>Logging out...</div>}
      </div>
    </div>
  );
}

export default ProfilePage;