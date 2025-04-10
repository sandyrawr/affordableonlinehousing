// LocationForm.js
import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="number" name="transportcost" placeholder="Transport Cost" onChange={handleChange} required />
      <input type="number" name="utilitycost" placeholder="Utility Cost" onChange={handleChange} required />
      <input type="number" name="foodcost" placeholder="Food Cost" onChange={handleChange} required />
      <input type="number" name="safetyrating" placeholder="Safety Rating" onChange={handleChange} required />
      <input type="file" name="image" accept="image/*" onChange={handleChange} />
      <button type="submit">Add Location</button>
    </form>
  );
};

export default LocationForm;
