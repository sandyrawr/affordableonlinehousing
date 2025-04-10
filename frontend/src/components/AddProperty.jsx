import React, { useState } from 'react';
import axios from 'axios';

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    bedroom: '',
    livingroom: '',
    washroom: '',
    kitchen: '',
    status: true,
    coliving: false,
    parking: false,
    balcony: false,
    petfriendly: false,
    owner: '', // Owner ID
    location: '', // Location ID
    prpimage: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    for (let key in formData) {
      submitData.append(key, formData[key]);
    }

    try {
      const res = await axios.post('http://localhost:8000/api/properties/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Property added successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add property.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="number" name="rent" placeholder="Rent" onChange={handleChange} required />
      <input type="number" name="bedroom" placeholder="Bedrooms" onChange={handleChange} required />
      <input type="number" name="livingroom" placeholder="Living Rooms" onChange={handleChange} required />
      <input type="number" name="washroom" placeholder="Washrooms" onChange={handleChange} required />
      <input type="number" name="kitchen" placeholder="Kitchens" onChange={handleChange} required />
      <label><input type="checkbox" name="status" checked={formData.status} onChange={handleChange} /> Active</label>
      <label><input type="checkbox" name="coliving" checked={formData.coliving} onChange={handleChange} /> Coliving</label>
      <label><input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} /> Parking</label>
      <label><input type="checkbox" name="balcony" checked={formData.balcony} onChange={handleChange} /> Balcony</label>
      <label><input type="checkbox" name="petfriendly" checked={formData.petfriendly} onChange={handleChange} /> Pet Friendly</label>
      <input type="number" name="owner" placeholder="Owner ID" onChange={handleChange} required />
      <input type="number" name="location" placeholder="Location ID" onChange={handleChange} required />
      <input type="file" name="prpimage" accept="image/*" onChange={handleChange} />
      <button type="submit">Add Property</button>
    </form>
  );
};

export default PropertyForm;
