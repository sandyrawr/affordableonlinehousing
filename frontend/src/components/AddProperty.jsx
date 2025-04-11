import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProperty = () => {
  const [locations, setLocations] = useState([]);
  const [ownerId, setOwnerId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    property_type: '',
    description: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    total_rooms: 1,
    floor_level: '',
    total_floors: 1,
    property_size: '',
    rent: '',
    price_type: '',
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
    const fetchLocations = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/locations/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(res.data);
      } catch (err) {
        console.error('Failed to load locations:', err);
      }
    };

    const fetchOwnerId = async () => {
      const token = localStorage.getItem('token');
      try {
        const userRes = await axios.get('/api/user/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = userRes.data.id;

        const ownerRes = await axios.get(`/api/owners/user/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOwnerId(ownerRes.data.id);
      } catch (err) {
        console.error('Failed to get owner ID:', err);
      }
    };

    fetchLocations();
    fetchOwnerId();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ownerId) {
      alert('Owner not found!');
      return;
    }

    const token = localStorage.getItem('token');
    const propertyData = new FormData();

    for (const key in formData) {
      propertyData.append(key, formData[key]);
    }
    propertyData.append('owner', ownerId);

    try {
      await axios.post('/api/properties/', propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Property added successfully!');
    } catch (err) {
      console.error('Error submitting property:', err);
      alert('Submission failed!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Property</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        
        <select name="property_type" onChange={handleChange} required>
          <option value="">Select Property Type</option>
          {['Apartment', 'House', 'Studio', 'Villa', 'Commercial', 'Flat'].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

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
        <input type="text" name="property_size" placeholder="Property Size" onChange={handleChange} required />
        <input type="number" step="0.01" name="rent" placeholder="Rent" onChange={handleChange} required />

        <select name="price_type" onChange={handleChange} required>
          <option value="">Select Price Type</option>
          <option value="Fixed">Fixed</option>
          <option value="Negotiable">Negotiable</option>
        </select>

        <textarea name="description" placeholder="Description" onChange={handleChange} className="md:col-span-2"></textarea>

        {/* Boolean Fields */}
        {[
          'balcony_terrace', 'parking_space', 'garden_yard', 'swimming_pool',
          'lift_elevator', 'pet_friendly', 'gym'
        ].map((field) => (
          <label key={field} className="flex items-center gap-2">
            <input type="checkbox" name={field} onChange={handleChange} />
            {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
        ))}

        <input type="file" name="property_image" onChange={handleChange} accept="image/*" className="md:col-span-2" />

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded md:col-span-2">
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
