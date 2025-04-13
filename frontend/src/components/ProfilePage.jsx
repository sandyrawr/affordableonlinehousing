import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Property from './Property';
import AddProperty from './AddProperty';
import BookingRequests from './BookingRequests';
import TourRequests from './TourRequests';
import './ProfilePage.css';
import MyProperties from './MyProperties';

// import './ProfilePage.css'; // Optional styling file

function ProfilePage() {
  const [activeSection, setActiveSection] = useState('profile'); // Default to 'profile'

  return (
    <div className="profile-page-container">
      <div className="sidebar">
        <ul>
          <li>
            <button onClick={() => setActiveSection('profile')}>Profile</button>
          </li>
          <li>
            <button onClick={() => setActiveSection('addproperty')}>Add Property</button>
          </li>
          <li>
            <button onClick={() => setActiveSection('myProperties')}>My Properties</button>
          </li>
          <li>
            <button onClick={() => setActiveSection('tourRequests')}>Tour Requests</button>
          </li>
          <li>
            <button onClick={() => setActiveSection('bookingRequests')}>Booking Requests</button>
          </li>
          <li>
            <button onClick={() => setActiveSection('logout')}>Log Out</button>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/tour-requests" element={<TourRequests />} />
          <Route path="/booking-requests" element={<BookingRequests />} />
        </Routes>

        {/* Conditionally render content based on activeSection */}
        {activeSection === 'profile' && (
          <div>
            <h2>Welcome to your profile!</h2>
            <p>Here you can manage your account settings, view your info, etc.</p>
            {/* Add more profile info or editable form here */}
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
