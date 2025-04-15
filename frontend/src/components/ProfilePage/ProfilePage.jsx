import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Property from '../Unused/Property';
import AddProperty from '../AddProperty/AddProperty';
import BookingRequests from '../Unused/BookingRequests';
import TourRequests from '../Unused/TourRequests';
import styles from './ProfilePage.module.css';
import MyProperties from '../MyProperties/MyProperties';
import axios from 'axios';
import { UserCircle, Trash2, Save } from 'lucide-react';

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
          setFormData(res.data);
          setImagePreview(res.data.user_image);
        })
        .catch(err => console.error('Error fetching owner data:', err));
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

    Object.keys(formData).forEach(key => {
      form.append(key, formData[key]);
    });

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(ownerData);
    if (!hasChanges) {
      setMessage('No changes to update.');
      return;
    }

    axios.patch('http://localhost:8000/owner-profile/', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        setMessage('Changes saved successfully.');
        setOwnerData(formData);
      })
      .catch(err => console.error('Error updating profile:', err));
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
          <Route path="/booking-requests" element={<BookingRequests />} />
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
                      style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
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
        {activeSection === 'bookingRequests' && <BookingRequests />}
        {activeSection === 'logout' && <div>Logging out...</div>}
      </div>
    </div>
  );
}

export default ProfilePage;
