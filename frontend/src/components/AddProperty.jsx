import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProperty.css'; // Import your CSS file for styling

function AddProperty() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    property_type: 'Apartment',
    description: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    total_rooms: 1,
    floor_level: '',
    total_floors: 1,
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
    // Fetch location list for dropdown
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:8000/locations/');
        setLocations(res.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (files ? files[0] : value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/add-property/',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Property added successfully!');
      console.log(res.data);
    } catch (error) {
      console.error('Failed to add property:', error);
      alert('Failed to add property.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Property</h2>

      <input name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />

      <select name="property_type" onChange={handleChange}>
        <option>Apartment</option>
        <option>House</option>
        <option>Studio</option>
        <option>Villa</option>
        <option>Commercial</option>
        <option>Flat</option>
      </select>

      <select name="location" onChange={handleChange} required>
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>{loc.name}</option>
        ))}
      </select>

      <input name="bedrooms" type="number" placeholder="Bedrooms" onChange={handleChange} />
      <input name="bathrooms" type="number" placeholder="Bathrooms" onChange={handleChange} />
      <input name="total_rooms" type="number" placeholder="Total Rooms" onChange={handleChange} />
      <input name="floor_level" placeholder="Floor Level" onChange={handleChange} />
      <input name="total_floors" type="number" placeholder="Total Floors" onChange={handleChange} />
      <input name="property_size" placeholder="Property Size" onChange={handleChange} />
      <input name="rent" type="number" placeholder="Rent" onChange={handleChange} />

      <select name="price_type" onChange={handleChange}>
        <option value="Fixed">Fixed</option>
        <option value="Negotiable">Negotiable</option>
      </select>

      <label><input type="checkbox" name="balcony_terrace" onChange={handleChange} /> Balcony/Terrace</label>
      <label><input type="checkbox" name="parking_space" onChange={handleChange} /> Parking Space</label>
      <label><input type="checkbox" name="garden_yard" onChange={handleChange} /> Garden/Yard</label>
      <label><input type="checkbox" name="swimming_pool" onChange={handleChange} /> Swimming Pool</label>
      <label><input type="checkbox" name="lift_elevator" onChange={handleChange} /> Lift/Elevator</label>
      <label><input type="checkbox" name="pet_friendly" onChange={handleChange} /> Pet Friendly</label>
      <label><input type="checkbox" name="gym" onChange={handleChange} /> Gym</label>

      <input type="file" name="property_image" onChange={handleChange} />

      <button type="submit">Add Property</button>
    </form>
  );
}

export default AddProperty;
