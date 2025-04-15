import React, { useState } from 'react';
import './LocationForm.css'; // Add this line for the CSS

const LocationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    transportcost: '',
    utilitycost: '',
    foodcost: '',
    safetyrating: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submission = new FormData();
    for (const key in formData) {
      submission.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:8000/add-location/', {
        method: 'POST',
        body: submission,
      });

      if (response.ok) {
        alert('Location added successfully!');
      } else {
        alert('Failed to add location.');
      }
    } catch (error) {
      console.error(error);
      alert('Server error');
    }
  };

  return (
    <div className="location-form-container">
      <h2 className="form-title">Add New Location</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="location-form">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="form-input" />
        <input type="number" name="transportcost" placeholder="Transport Cost" onChange={handleChange} required className="form-input" />
        <input type="number" name="utilitycost" placeholder="Utility Cost" onChange={handleChange} required className="form-input" />
        <input type="number" name="foodcost" placeholder="Food Cost" onChange={handleChange} required className="form-input" />
        <input type="number" name="safetyrating" placeholder="Safety Rating" onChange={handleChange} required className="form-input" />
        <input type="file" name="image" accept="image/*" onChange={handleChange} className="form-input-file" />
        <button type="submit" className="form-button">Add Location</button>
      </form>
    </div>
  );
};

export default LocationForm;
