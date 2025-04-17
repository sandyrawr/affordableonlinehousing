import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AddProperty from '../AddProperty/AddProperty';
import MyProperties from '../MyProperties/MyProperties';
import Bookings from '../Bookings/Bookings';
import TourRequests from '../TourRequests/TourRequests';
// import TourRequests from '../Unused/TourRequests';
// import BookingRequests from '../Unused/BookingRequests';
import styles from './ProfilePage.module.css';
import axios from 'axios';
import { Save, Trash2 } from 'lucide-react';

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

    // Object.keys(formData).forEach(key => {
    //   form.append(key, formData[key]);
    // });

    const hasChanges =
    formData.name !== ownerData.name ||
    formData.phone_number !== ownerData.phone_number ||
    formData.email !== ownerData.user?.email ||
    formData.employment_status !== ownerData.employment_status ||
    formData.criminal_history !== ownerData.criminal_history ||
    hasImageChanged ||
    formData.new_password;
    // Compare current formData with ownerData to check if anything changed
    // const hasChanges = JSON.stringify(formData) !== JSON.stringify(ownerData);
    if (!hasChanges) {
      setMessage('No changes to update.');
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
    <div className={styles.profilePageContainer}>
      <div className={styles.sidebar}>
        <ul>
          <li><button onClick={() => setActiveSection('profile')}>Profile</button></li>
          <li><button onClick={() => setActiveSection('addproperty')}>Add Property</button></li>
          <li><button onClick={() => setActiveSection('myProperties')}>My Properties</button></li>
          <li><button onClick={() => setActiveSection('tourRequests')}>Tour Requests</button></li>
          <li><button onClick={() => setActiveSection('bookingRequests')}>Booking Requests</button></li>
          <li><button onClick={() => setActiveSection('logout')}>Log Out</button></li>
        </ul>
      </div>
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/tour-requests" element={<TourRequests />} />
          <Route path="/booking-requests" element={<Bookings />} />
        </Routes>

        {activeSection === 'profile' && (
          <div>
            <h2>Welcome to your profile!</h2>
            <p>Here you can manage your account settings, view your info, etc.</p>
            {message && <p>{message}</p>}
            {ownerData && (
              <div style={{ maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className={styles.profileImage}
                      // style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  </label>
                  <input id="imageUpload" type="file" hidden onChange={handleImageChange} />
                </div>
                <div>
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
                </div>
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
        )}

        {activeSection === 'addproperty' && <AddProperty />}
        {activeSection === 'myProperties' && <MyProperties />}
        {activeSection === 'tourRequests' && <TourRequests />}
        {activeSection === 'bookingRequests' && <Bookings />}
        {activeSection === 'logout' && <div>Logging out...</div>}
      </div>
    </div>
  );
}

export default ProfilePage;
