import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProperty = () => {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    property_type: 'Apartment',
    description: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    total_rooms: '',
    floor_level: '',
    total_floors: '',
    owner: '',  // You need to prefill or select the owner ID here
    property_size: '',
    rent: '',
    price_type: 'Fixed',
    balcony_terrace: false,
    parking_space: false,
    garden_yard: false,
    swimming_pool: false,
    lift_elevator: false,
    pet_friendly: false,
    gym: false,
    property_image: null,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData && userData.ownerId) {
      setFormData(prevFormData => ({
        ...prevFormData,
        owner: userData.ownerId,
      }));
    }


    axios.get('http://localhost:8000/location/')
      .then(response => setLocations(response.data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, property_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    const token = userData?.accessToken;

    try {
      const response = await axios.post('http://localhost:8000/add-property/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
           Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert('Property added successfully!');
      } else {
        alert('Failed to add property.');
      }
    } catch (error) {
      console.error(error);
      alert('Error while adding property');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      
      <select name="property_type" onChange={handleChange}>
        <option value="Apartment">Apartment</option>
        <option value="House">House</option>
        <option value="Studio">Studio</option>
        <option value="Villa">Villa</option>
        <option value="Commercial">Commercial</option>
        <option value="Flat">Flat</option>
      </select>

      <textarea name="description" placeholder="Description" onChange={handleChange} required></textarea>

      <select name="location" onChange={handleChange} required>
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>{loc.name}</option>
        ))}
      </select>

      <input type="number" name="bedrooms" placeholder="Bedrooms" onChange={handleChange} required />
      <input type="number" name="bathrooms" placeholder="Bathrooms" onChange={handleChange} required />
      <input type="number" name="total_rooms" placeholder="Total Rooms" onChange={handleChange} required />
      <input type="text" name="floor_level" placeholder="Floor Level" onChange={handleChange} required />
      <input type="number" name="total_floors" placeholder="Total Floors" onChange={handleChange} required />
      {/* <input type="number" name="owner" placeholder="Owner ID" onChange={handleChange} required /> */}
      <input type="text" name="property_size" placeholder="Property Size" onChange={handleChange} required />
      <input type="number" name="rent" placeholder="Rent" step="0.01" onChange={handleChange} required />

      <select name="price_type" onChange={handleChange}>
        <option value="Fixed">Fixed</option>
        <option value="Negotiable">Negotiable</option>
      </select>

      {/* Boolean features */}
      {[
        'balcony_terrace',
        'parking_space',
        'garden_yard',
        'swimming_pool',
        'lift_elevator',
        'pet_friendly',
        'gym',
      ].map((feature) => (
        <label key={feature}>
          <input
            type="checkbox"
            name={feature}
            checked={formData[feature]}
            onChange={handleChange}
          />
          {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </label>
      ))}

      <input type="file" name="property_image" accept="image/*" onChange={handleChange} required />
      <button type="submit">Add Property</button>
    </form>
  );
};

export default AddProperty;
