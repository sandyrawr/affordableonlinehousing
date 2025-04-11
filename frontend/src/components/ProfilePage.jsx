import React, { useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Property from './Property';
import AddProperty from './AddProperty';
import BookingRequests from './BookingRequests';
import TourRequests from './TourRequests';
// import MyProperties from './MyProperties';
// import TourRequests from './TourRequests';
// import BookingRequests from './BookingRequests';
// import './ProfilePage.css';  // Optional: to style the layout

function ProfilePage() {
  const [activeSection, setActiveSection] = useState('addProperty');

  return (
    <div className="profile-page-container">
      <div className="sidebar">
        <h2>Profile</h2>
        <ul>
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
          <Route path="/my-properties" element={<Property />} />
          <Route path="/tour-requests" element={<TourRequests />} />
          <Route path="/booking-requests" element={<BookingRequests />} />
        </Routes>
        {/* Conditionally render content based on activeSection */}
        {activeSection === 'addproperty' && <AddProperty />}
        {activeSection === 'myProperties' && <Property />}
        {activeSection === 'tourRequests' && <TourRequests />}
        {activeSection === 'bookingRequests' && <BookingRequests />}
        {activeSection === 'logout' && <div>Logging out...</div>}  {/* You can add actual logout logic here */}
      </div>
    </div>
  );
}

export default ProfilePage;
