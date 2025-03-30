import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function EditPropertyForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { property } = location.state || {};
  
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
    petfriendly: false
  });

  // Populate form with property data if available
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        rent: property.rent.toString(),
        bedroom: property.bedroom.toString(),
        livingroom: property.livingroom.toString(),
        washroom: property.washroom.toString(),
        kitchen: property.kitchen.toString(),
        status: property.status,
        coliving: property.coliving,
        parking: property.parking,
        balcony: property.balcony,
        petfriendly: property.petfriendly
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        rent: parseInt(formData.rent),
        bedroom: parseInt(formData.bedroom),
        livingroom: parseInt(formData.livingroom),
        washroom: parseInt(formData.washroom),
        kitchen: parseInt(formData.kitchen)
      };

      if (property) {
        // Update existing property
        await axios.put(`http://127.0.0.1:8000/property/${property.id}/`, data);
        alert('Property updated successfully');
      } else {
        // Create new property (though this form is primarily for editing)
        await axios.post('http://127.0.0.1:8000/property/', data);
        alert('Property created successfully');
      }
      
      navigate('/edit-property'); // Return to property list
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Failed to save property');
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">
        {property ? 'Edit Property' : 'Create New Property'}
      </h1>
      
      <div className="card shadow mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div className="form-group">
              <label>Property Title*</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description Field */}
            <div className="form-group mt-3">
              <label>Description*</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            {/* Rent and Status */}
            <div className="row mt-3">
              <div className="col-md-6">
                <label>Monthly Rent ($)*</label>
                <input
                  type="number"
                  className="form-control"
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Status</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    {formData.status ? 'Available' : 'Not Available'}
                  </label>
                </div>
              </div>
            </div>

            {/* Room Counts */}
            <div className="row mt-3">
              {['bedroom', 'livingroom', 'washroom', 'kitchen'].map((room) => (
                <div className="col-md-3" key={room}>
                  <label>{room.charAt(0).toUpperCase() + room.slice(1)}*</label>
                  <input
                    type="number"
                    className="form-control"
                    name={room}
                    value={formData[room]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="row mt-3">
              {[
                { name: 'coliving', label: 'Co-living Space' },
                { name: 'parking', label: 'Parking Available' },
                { name: 'balcony', label: 'Balcony' },
                { name: 'petfriendly', label: 'Pet Friendly' }
              ].map((feature) => (
                <div className="col-md-3" key={feature.name}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name={feature.name}
                      checked={formData[feature.name]}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">{feature.label}</label>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/edit-property')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditPropertyForm;