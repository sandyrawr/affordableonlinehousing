import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "./AddProperty.module.css";
import { 
  Home, MapPin, Bed, Bath, Users, Layers, Ruler, DollarSign, 
  Check, Car, Trees, Waves, ArrowUp, PawPrint, Image, Plus 
} from 'lucide-react';

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
    status: false,
    property_image: null,
  });

  useEffect(() => {
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

  const handleStatusChange = (e) => {
    const value = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      status: value,
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
    <div className={styles.addPropertyContainer}>
      <form onSubmit={handleSubmit} className={styles.propertyForm}>
        <h2 className={styles.formTitle}>Add New Property</h2>

        <div className={styles.formColumns}>
          <div className={styles.leftColumn}>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Property Title</label>
              <div className={styles.inputWithIcon}>
                <Home className={styles.inputIcon} />
                <input 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange} 
                  required 
                  className={styles.inputField}
                  placeholder="Enter property title"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Property Type</label>
              <div className={styles.inputWithIcon}>
                <Home className={styles.inputIcon} />
                <select 
                  name="property_type" 
                  onChange={handleChange}
                  className={styles.inputField}
                >
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Studio</option>
                  <option>Villa</option>
                  <option>Commercial</option>
                  <option>Flat</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Location</label>
              <div className={styles.inputWithIcon}>
                <MapPin className={styles.inputIcon} />
                <select 
                  name="location" 
                  onChange={handleChange} 
                  required
                  className={styles.inputField}
                  value={formData.location}
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Bedrooms</label>
              <div className={styles.inputWithIcon}>
                <Bed className={styles.inputIcon} />
                <input 
                  name="bedrooms" 
                  type="number" 
                  value={formData.bedrooms}
                  onChange={handleChange} 
                  className={styles.inputField}
                  placeholder="Number of bedrooms"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Bathrooms</label>
              <div className={styles.inputWithIcon}>
                <Bath className={styles.inputIcon} />
                <input 
                  name="bathrooms" 
                  type="number" 
                  value={formData.bathrooms}
                  onChange={handleChange} 
                  className={styles.inputField}
                  placeholder="Number of bathrooms"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Total Rooms</label>
              <div className={styles.inputWithIcon}>
                <Users className={styles.inputIcon} />
                <input 
                  name="total_rooms" 
                  type="number" 
                  value={formData.total_rooms}
                  onChange={handleChange} 
                  className={styles.inputField}
                  placeholder="Total number of rooms"
                />
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Floor Level</label>
              <div className={styles.inputWithIcon}>
                <Layers className={styles.inputIcon} />
                <input 
                  name="floor_level" 
                  value={formData.floor_level}
                  onChange={handleChange} 
                  className={styles.inputField}
                  placeholder="Floor level number"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Total Floors</label>
              <div className={styles.inputWithIcon}>
                <Layers className={styles.inputIcon} />
                <input 
                  name="total_floors" 
                  type="number" 
                  value={formData.total_floors}
                  onChange={handleChange} 
                  className={styles.inputField}
                  placeholder="Total floors in building"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Property Size (sq ft)</label>
              <div className={styles.inputWithIcon}>
                <Ruler className={styles.inputIcon} />
                <input 
                  name="property_size" 
                  value={formData.property_size}
                  onChange={handleChange} 
                  className={styles.inputField}
                  placeholder="Property area in square feet"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Rent</label>
              <div className={styles.inputWithIcon}>
                <DollarSign className={styles.inputIcon} />
                <input 
                  name="rent" 
                  type="number" 
                  value={formData.rent}
                  onChange={handleChange} 
                  className={styles.inputField}
                  placeholder="Monthly rent amount"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Price Type</label>
              <div className={styles.inputWithIcon}>
                <DollarSign className={styles.inputIcon} />
                <select 
                  name="price_type" 
                  onChange={handleChange}
                  className={styles.inputField}
                  value={formData.price_type}
                >
                  <option value="Fixed">Fixed</option>
                  <option value="Negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>Availability</label>
              <div className={styles.inputWithIcon}>
                <Check className={styles.inputIcon} />
                <select 
                  name="status" 
                  onChange={handleStatusChange}
                  className={styles.inputField}
                  value={formData.status}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Description</label>
          <textarea 
            name="description" 
            value={formData.description}
            onChange={handleChange} 
            required 
            className={styles.textareaField}
            placeholder="Detailed description of the property"
          />
        </div>

        <div className={styles.amenitiesSection}>
          <h3 className={styles.amenitiesTitle}>Amenities</h3>
          <div className={styles.amenitiesGrid}>
            <label className={styles.amenityCheckbox}>
              <input 
                type="checkbox" 
                name="balcony_terrace" 
                checked={formData.balcony_terrace}
                onChange={handleChange} 
              />
              <span className={styles.checkboxLabel}>
                <Waves className={styles.amenityIcon} /> Balcony/Terrace
              </span>
            </label>
            <label className={styles.amenityCheckbox}>
              <input 
                type="checkbox" 
                name="parking_space" 
                checked={formData.parking_space}
                onChange={handleChange} 
              />
              <span className={styles.checkboxLabel}>
                <Car className={styles.amenityIcon} /> Parking Space
              </span>
            </label>
            <label className={styles.amenityCheckbox}>
              <input 
                type="checkbox" 
                name="garden_yard" 
                checked={formData.garden_yard}
                onChange={handleChange} 
              />
              <span className={styles.checkboxLabel}>
                <Trees className={styles.amenityIcon} /> Garden/Yard
              </span>
            </label>
            <label className={styles.amenityCheckbox}>
              <input 
                type="checkbox" 
                name="swimming_pool" 
                checked={formData.swimming_pool}
                onChange={handleChange} 
              />
              <span className={styles.checkboxLabel}>
                <Waves className={styles.amenityIcon} /> Swimming Pool
              </span>
            </label>
            <label className={styles.amenityCheckbox}>
              <input 
                type="checkbox" 
                name="lift_elevator" 
                checked={formData.lift_elevator}
                onChange={handleChange} 
              />
              <span className={styles.checkboxLabel}>
                <ArrowUp className={styles.amenityIcon} /> Lift/Elevator
              </span>
            </label>
            <label className={styles.amenityCheckbox}>
              <input 
                type="checkbox" 
                name="pet_friendly" 
                checked={formData.pet_friendly}
                onChange={handleChange} 
              />
              <span className={styles.checkboxLabel}>
                <PawPrint className={styles.amenityIcon} /> Pet Friendly
              </span>
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.inputLabel}>Property Image</label>
          <div className={styles.fileInputContainer}>
            <Image className={styles.fileInputIcon} />
            <input 
              type="file" 
              name="property_image" 
              onChange={handleChange} 
              className={styles.fileInput}
            />
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          <Plus className={styles.buttonIcon} /> Add Property
        </button>
      </form>
    </div>
  );
}

export default AddProperty;