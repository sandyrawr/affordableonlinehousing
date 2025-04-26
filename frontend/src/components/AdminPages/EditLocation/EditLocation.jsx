import React, { useState, useEffect } from 'react';
import { MapPin, Home, DollarSign, Shield, Utensils, Zap, HeartPulse, Shirt, PawPrint, X, Save, Image, Edit, Trash2 } from 'lucide-react';
import styles from './EditLocation.module.css';

const EditLocation = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [editData, setEditData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8000/locations/');
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setEditData({ ...location });
    setNewImage(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all fields
    for (const key in editData) {
      if (key !== 'image') {
        formData.append(key, editData[key]);
      }
    }
    
    // Append new image if selected, otherwise keep original
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const response = await fetch(`http://localhost:8000/locations/${selectedLocation.id}/`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations(locations.map(loc => 
          loc.id === updatedLocation.id ? updatedLocation : loc
        ));
        setIsModalOpen(false);
      } else {
        console.error('Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleDeleteLocation = async () => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/locations/${selectedLocation.id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 1. Close modal FIRST
        setIsModalOpen(false);
        
        // 2. Clear the selected location
        setSelectedLocation(null);
        
        // 3. Refresh locations
        fetchLocations();
      } else {
        console.error('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Locations</h2>
      <div className={styles.locationsGrid}>
        {locations.map(location => (
          <div 
            key={location.id} 
            className={styles.locationCard}
            onClick={() => handleLocationClick(location)}
          > 
            {location.image && (
              <div className={styles.imageContainer}>
                <img 
                  src={location.image} 
                  alt={location.name} 
                  className={styles.locationImage}
                />
              </div>
            )}
            <div className={styles.cardContent}>
              <h3><MapPin size={16} /> {location.name}</h3>
              <p><Shield size={16} /> Safety: {location.safetyrating}/10</p>
              <p><DollarSign size={16} /> Transport: ${location.transportcost}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedLocation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>
                <Edit size={18} /> Edit Location: {selectedLocation.name}
              </h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.imageUploadContainer}>
                {selectedLocation.image && (
                  <img 
                    src={newImage ? URL.createObjectURL(newImage) : selectedLocation.image}
                    alt={selectedLocation.name} 
                    className={styles.modalImage}
                  />
                )}
                <label className={styles.imageUploadLabel}>
                  <Image size={16} /> Change Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className={styles.imageInput}
                  />
                </label>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label><MapPin size={16} /> Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label><DollarSign size={16} /> Transport Cost:</label>
                  <input
                    type="number"
                    name="transportcost"
                    value={editData.transportcost || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label><Zap size={16} /> Utility Cost:</label>
                  <input
                    type="number"
                    name="utilitycost"
                    value={editData.utilitycost || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label><Utensils size={16} /> Food Cost:</label>
                  <input
                    type="number"
                    name="foodcost"
                    value={editData.foodcost || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label><HeartPulse size={16} /> Healthcare Cost:</label>
                  <input
                    type="number"
                    name="healthcarecost"
                    value={editData.healthcarecost || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label><Shirt size={16} /> Clothing Cost:</label>
                  <input
                    type="number"
                    name="clothingcost"
                    value={editData.clothingcost || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label><PawPrint size={16} /> Pet Health Cost:</label>
                  <input
                    type="number"
                    name="pethealthcost"
                    value={editData.pethealthcost || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label><Shield size={16} /> Safety Rating:</label>
                  <input
                    type="number"
                    name="safetyrating"
                    value={editData.safetyrating || ''}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              
              <div className={styles.buttonGroup}>
              <button 
                className={styles.modalDeleteButton}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this location?')) {
                    handleDeleteLocation(selectedLocation.id);
                  }
                }}
              >
                <Trash2 size={18} /> Delete
              </button>
                <button type="submit" className={styles.saveButton}>
                  <Save size={16} /> Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditLocation;