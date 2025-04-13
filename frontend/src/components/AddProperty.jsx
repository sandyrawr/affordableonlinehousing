import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Property.css'; // Using the same CSS file

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

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    total_rooms: '',
    floor_level: '',
    total_floors: '',
    property_size: '',
    rent: '',
  });

  useEffect(() => {
    axios.get('http://localhost:8000/location/')
      .then(response => setLocations(response.data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return "Title is required";
        if (value.length > 255) return "Title too long (max 255 characters)";
        return "";
      case 'description':
        if (!value.trim()) return "Description is required";
        if (value.length > 1000) return "Description too long (max 1000 characters)";
        return "";
      case 'rent':
        if (!value) return "Rent is required";
        if (!/^\d+$/.test(value)) return "Must be a whole number";
        if (parseInt(value) <= 0) return "Must be greater than 0";
        return "";
      case 'bedrooms':
      case 'bathrooms':
      case 'total_rooms':
      case 'total_floors':
        if (!value) return "This field is required";
        if (!/^\d+$/.test(value)) return "Must be a whole number";
        if (parseInt(value) <= 0) return "Must be greater than 0";
        return "";
      case 'location':
        if (!value) return "Location is required";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, property_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description),
      location: validateField('location', formData.location),
      bedrooms: validateField('bedrooms', formData.bedrooms),
      bathrooms: validateField('bathrooms', formData.bathrooms),
      total_rooms: validateField('total_rooms', formData.total_rooms),
      floor_level: validateField('floor_level', formData.floor_level),
      total_floors: validateField('total_floors', formData.total_floors),
      property_size: validateField('property_size', formData.property_size),
      rent: validateField('rent', formData.rent),
    };
    
    setErrors(newErrors);
    
    // Check if any errors exist
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    const ownerId = userData?.ownerId;
    const token = userData?.accessToken;
    
    if (!ownerId) {
      alert('Owner information missing. Please login again.');
      return;
    }

    const data = new FormData();
    data.append('owner', ownerId);
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post('http://localhost:8000/add-property/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert('Property added successfully!');
        // Reset form after successful submission
        setFormData({
          title: '',
          property_type: 'Apartment',
          description: '',
          location: '',
          bedrooms: '',
          bathrooms: '',
          total_rooms: '',
          floor_level: '',
          total_floors: '',
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
      } else {
        alert('Failed to add property.');
      }
    } catch (error) {
      console.error(error);
      alert('Error while adding property');
    }
  };

  return (
    <div className="property-container">
      <property-content>
        <h1 className="text-center my-4">Add New Property</h1>
        
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Property Image*</label>
                <input
                  type="file"
                  className="form-control"
                  name="property_image"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mt-3">
                <label>Property Title*</label>
                <input
                  type="text"
                  className={`form-control ${errors.title && "is-invalid"}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter property title"
                  required
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="form-group mt-3">
                <label>Description*</label>
                <textarea
                  className={`form-control ${errors.description && "is-invalid"}`}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter property description"
                  rows="3"
                  required
                />
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <label>Property Type*</label>
                  <select
                    className="form-select"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Studio">Studio</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Flat">Flat</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Location*</label>
                  <select
                    className={`form-select ${errors.location && "is-invalid"}`}
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                  {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-3">
                  <label>Monthly Rent ($)*</label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.rent && "is-invalid"}`}
                    name="rent"
                    value={formData.rent}
                    onChange={handleChange}
                    placeholder="Enter monthly rent"
                    required
                  />
                  {errors.rent && <div className="invalid-feedback">{errors.rent}</div>}
                </div>

                <div className="col-md-3">
                  <label>Price Type*</label>
                  <select
                    className="form-select"
                    name="price_type"
                    value={formData.price_type}
                    onChange={handleChange}
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Negotiable">Negotiable</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label>Property Size*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.property_size && "is-invalid"}`}
                    name="property_size"
                    value={formData.property_size}
                    onChange={handleChange}
                    placeholder="Property size"
                    required
                  />
                  {errors.property_size && <div className="invalid-feedback">{errors.property_size}</div>}
                </div>

                <div className="col-md-3">
                  <label>Floor Level*</label>
                  <input
                    type="text"
                    className={`form-control ${errors.floor_level && "is-invalid"}`}
                    name="floor_level"
                    value={formData.floor_level}
                    onChange={handleChange}
                    placeholder="Floor level"
                    required
                  />
                  {errors.floor_level && <div className="invalid-feedback">{errors.floor_level}</div>}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-3">
                  <label>Bedrooms*</label>
                  <input
                    type="number"
                    className={`form-control ${errors.bedrooms && "is-invalid"}`}
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="Number of bedrooms"
                    required
                  />
                  {errors.bedrooms && <div className="invalid-feedback">{errors.bedrooms}</div>}
                </div>

                <div className="col-md-3">
                  <label>Bathrooms*</label>
                  <input
                    type="number"
                    className={`form-control ${errors.bathrooms && "is-invalid"}`}
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="Number of bathrooms"
                    required
                  />
                  {errors.bathrooms && <div className="invalid-feedback">{errors.bathrooms}</div>}
                </div>

                <div className="col-md-3">
                  <label>Total Rooms*</label>
                  <input
                    type="number"
                    className={`form-control ${errors.total_rooms && "is-invalid"}`}
                    name="total_rooms"
                    value={formData.total_rooms}
                    onChange={handleChange}
                    placeholder="Total number of rooms"
                    required
                  />
                  {errors.total_rooms && <div className="invalid-feedback">{errors.total_rooms}</div>}
                </div>

                <div className="col-md-3">
                  <label>Total Floors*</label>
                  <input
                    type="number"
                    className={`form-control ${errors.total_floors && "is-invalid"}`}
                    name="total_floors"
                    value={formData.total_floors}
                    onChange={handleChange}
                    placeholder="Total floors in building"
                    required
                  />
                  {errors.total_floors && <div className="invalid-feedback">{errors.total_floors}</div>}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="balcony_terrace"
                      checked={formData.balcony_terrace}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Balcony/Terrace</label>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="parking_space"
                      checked={formData.parking_space}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Parking Space</label>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="garden_yard"
                      checked={formData.garden_yard}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Garden/Yard</label>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="swimming_pool"
                      checked={formData.swimming_pool}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Swimming Pool</label>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="lift_elevator"
                      checked={formData.lift_elevator}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Lift/Elevator</label>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="pet_friendly"
                      checked={formData.pet_friendly}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Pet Friendly</label>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="gym"
                      checked={formData.gym}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Gym</label>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button type="submit" className="btn btn-primary">
                  Add Property
                </button>
              </div>
            </form>
          </div>
        </div>
      </property-content>
    </div>
  );
};

export default AddProperty;