import React, { useState } from 'react';
import { 
  MapPin, DollarSign, Zap, Utensils, Shield, 
  Shirt, Clapperboard, HeartPulse, PawPrint, 
  Image as ImageIcon, Upload 
} from 'lucide-react';
import './LocationForm.css';

const LocationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    transportcost: '',
    utilitycost: '',
    foodcost: '',
    entertainmentcost: '',
    healthcarecost: '',
    clothingcost: '',
    pethealthcost: '',
    safetyrating: '',
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submission = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        submission.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('http://localhost:8000/add-location/', {
        method: 'POST',
        body: submission,
      });

      if (response.ok) {
        alert('Location added successfully!');
        // Reset form after successful submission
        setFormData({
          name: '',
          transportcost: '',
          utilitycost: '',
          foodcost: '',
          entertainmentcost: '',
          healthcarecost: '',
          clothingcost: '',
          pethealthcost: '',
          safetyrating: '',
          image: null,
        });
        setPreviewImage(null);
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
      <h2 className="form-title"><MapPin size={24} /> Add New Location</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="location-form">
        {/* Image Upload - Full Width */}
        <div className="image-upload-container">
          <label className="image-upload-label">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">
                <ImageIcon size={48} />
                <span>Click to add image</span>
                <Upload size={16} className="upload-icon" />
              </div>
            )}
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              onChange={handleChange}
              className="image-input"
            />
          </label>
        </div>

        {/* Location Details */}
        <div className="form-group">
          <label><MapPin size={18} /> Location Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><DollarSign size={18} /> Transport Cost</label>
            <input 
              type="number" 
              name="transportcost" 
              value={formData.transportcost}
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label><Zap size={18} /> Utility Cost</label>
            <input 
              type="number" 
              name="utilitycost" 
              value={formData.utilitycost}
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><Utensils size={18} /> Food Cost</label>
            <input 
              type="number" 
              name="foodcost" 
              value={formData.foodcost}
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label><Clapperboard size={18} /> Entertainment Cost</label>
            <input 
              type="number" 
              name="entertainmentcost" 
              value={formData.entertainmentcost}
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><HeartPulse size={18} /> Healthcare Cost</label>
            <input 
              type="number" 
              name="healthcarecost" 
              value={formData.healthcarecost}
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label><Shirt size={18} /> Clothing Cost</label>
            <input 
              type="number" 
              name="clothingcost" 
              value={formData.clothingcost}
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><PawPrint size={18} /> Pet Health Cost</label>
            <input 
              type="number" 
              name="pethealthcost" 
              value={formData.pethealthcost}
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label><Shield size={18} /> Safety Rating (1-10)</label>
            <input 
              type="number" 
              name="safetyrating" 
              value={formData.safetyrating}
              onChange={handleChange} 
              min="1"
              max="10"
              required 
            />
          </div>
        </div>

        <button type="submit" className="form-button">
          <MapPin size={18} /> Add Location
        </button>
      </form>
    </div>
  );
};

export default LocationForm;