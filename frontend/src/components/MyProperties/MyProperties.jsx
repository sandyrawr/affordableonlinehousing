import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import styles from "./MyProperties.module.css";
import { 
  Home, MapPin, Bed, Bath, Users, Layers, Ruler, DollarSign, 
  Check, Car, Trees, Waves, ArrowUp, PawPrint, Image, Plus, 
  Calendar, Edit, Trash2, Save, CheckCircle
} from 'lucide-react';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      alert("You're not logged in. Please sign in again.");
      window.location.href = "/login";
      return;
    }

    const fetchData = async () => {
      try {
        const [propsRes, locsRes] = await Promise.all([
          axios.get("http://localhost:8000/my-properties/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/locations/"),
        ]);

        setProperties(propsRes.data);
        setLocations(locsRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        } else {
          console.error("Failed to fetch data:", err);
        }
      }
    };

    fetchData();
  }, [token]);

  const handleOpenModal = (property) => {
    const prepared = {
      ...property,
      location_id: property.location?.id || property.location_id,
      property_image: property.property_image,
      image_updated: false,
    };
    setSelectedProperty(prepared);
    setOriginalData(JSON.stringify(prepared));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value === "true";
    setSelectedProperty((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleImageClick = () => {
    document.getElementById("propertyImageInput").click();
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedProperty((prev) => ({
        ...prev,
        property_image: e.target.files[0],
        image_updated: true,
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const updatedFields = new FormData();
    const originalDataObj = JSON.parse(originalData);
    
    // Prepare all fields for update
    for (const key in originalDataObj) {
      if (key === 'id' || key === 'property_image') continue;
  
      const currentValue = selectedProperty[key] ?? originalDataObj[key];
  
      if (key === 'location_id') {
        console.log("Selected Property:", currentValue);
        updatedFields.append('location', currentValue);
        continue;
      }
  
      if ([
        'balcony_terrace', 'parking_space', 'garden_yard',
        'swimming_pool', 'lift_elevator', 'pet_friendly', 'status'
      ].includes(key)) {
        updatedFields.append(key, currentValue ? 'true' : 'false');
        continue;
      }
  
      updatedFields.append(key, currentValue);
    }
  
    // Handle image update
    if (selectedProperty.image_updated && selectedProperty.property_image instanceof File) {
      updatedFields.append('property_image', selectedProperty.property_image);
    }
  
    // Ensure owner is included
    if (!updatedFields.has('owner')) {
      updatedFields.append('owner', originalDataObj.owner);
    }
  
    try {
      await axios.put(`http://localhost:8000/property/${selectedProperty.id}/`, updatedFields, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      setShowModal(false);
      setShowSuccess(true);
      
      // Refresh properties without full page reload
      const res = await axios.get("http://localhost:8000/my-properties/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update property. Please check all required fields.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    
    try {
      await axios.delete(`http://localhost:8000/property/${selectedProperty.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setShowModal(false);
      setShowSuccess(true);
      
      // Refresh properties without full page reload
      const res = await axios.get("http://localhost:8000/my-properties/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperties(res.data);
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.propertiesContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>My Listed Properties</h2>
          <p className={styles.subtext}>Click a property to view or edit details.</p>
        </div>

        <div className={styles.propertyGrid}>
          {properties.map((property) => (
            <div key={property.id} className={styles.propertyCard} onClick={() => handleOpenModal(property)}>
              <div className={styles.imageContainer}>
                <img
                  src={`http://localhost:8000${property.property_image}`}
                  alt={property.title}
                  className={styles.propertyImage}
                />
              </div>
              <div className={styles.propertyDetails}>
                <h3 className={styles.propertyTitle}>{property.title}</h3>
                <div className={styles.detailItem}>
                  <MapPin className={styles.detailIcon} />
                  <span>
                    {locations.find(loc => loc.id === (property.location?.id || property.location))?.name || "Unknown"}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <Home className={styles.detailIcon} />
                  <span>{property.property_type}</span>
                </div>
                <div className={styles.detailItem}>
                  <Bed className={styles.detailIcon} />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className={styles.detailItem}>
                  <Bath className={styles.detailIcon} />
                  <span>{property.bathrooms} baths</span>
                </div>
                <div className={styles.detailItem}>
                  <Calendar className={styles.detailIcon} />
                  <span>Added: {new Date(property.date_added).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Property Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="xl" centered backdropClassName={styles.modalBackdrop}>
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              <Edit className={styles.modalTitleIcon} /> Edit Property
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            {selectedProperty && (
              <div className={styles.modalContent}>
                <div className={styles.modalLeftColumn}>
                  <div className={styles.imageUploadContainer}>
                    <img
                      src={
                        selectedProperty.property_image instanceof File
                          ? URL.createObjectURL(selectedProperty.property_image)
                          : `http://localhost:8000${selectedProperty.property_image}`
                      }
                      alt="Property"
                      className={styles.modalImage}
                      onClick={handleImageClick}
                    />
                    <input
                      id="propertyImageInput"
                      type="file"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    <p className={styles.imageUploadText}>Click image to change</p>
                  </div>

                  {/* Left Column Inputs */}
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Title</label>
                    <div className={styles.inputWithIcon}>
                      <Home className={styles.inputIcon} />
                      <input
                        type="text"
                        name="title"
                        value={selectedProperty.title}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Description</label>
                    <textarea
                      name="description"
                      value={selectedProperty.description}
                      onChange={handleChange}
                      className={styles.textareaField}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Location</label>
                    <div className={styles.inputWithIcon}>
                      <MapPin className={styles.inputIcon} />
                      <select
                        name="location_id"
                        value={selectedProperty.location_id}
                        onChange={handleChange}
                        className={styles.selectField}
                      >
                        <option value="">Select Location</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.modalRightColumn}>
                  {/* Right Column Inputs */}
                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Property Type</label>
                    <div className={styles.inputWithIcon}>
                      <Home className={styles.inputIcon} />
                      <select
                        name="property_type"
                        value={selectedProperty.property_type}
                        onChange={handleChange}
                        className={styles.selectField}
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
                    <label className={styles.inputLabel}>Bedrooms</label>
                    <div className={styles.inputWithIcon}>
                      <Bed className={styles.inputIcon} />
                      <input
                        type="number"
                        name="bedrooms"
                        value={selectedProperty.bedrooms}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Bathrooms</label>
                    <div className={styles.inputWithIcon}>
                      <Bath className={styles.inputIcon} />
                      <input
                        type="number"
                        name="bathrooms"
                        value={selectedProperty.bathrooms}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Total Rooms</label>
                    <div className={styles.inputWithIcon}>
                      <Users className={styles.inputIcon} />
                      <input
                        type="number"
                        name="total_rooms"
                        value={selectedProperty.total_rooms}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Floor Level</label>
                    <div className={styles.inputWithIcon}>
                      <Layers className={styles.inputIcon} />
                      <input
                        type="text"
                        name="floor_level"
                        value={selectedProperty.floor_level}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Total Floors</label>
                    <div className={styles.inputWithIcon}>
                      <Layers className={styles.inputIcon} />
                      <input
                        type="number"
                        name="total_floors"
                        value={selectedProperty.total_floors}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Property Size</label>
                    <div className={styles.inputWithIcon}>
                      <Ruler className={styles.inputIcon} />
                      <input
                        type="number"
                        step="0.01"
                        name="property_size"
                        value={selectedProperty.property_size}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Rent</label>
                    <div className={styles.inputWithIcon}>
                      <DollarSign className={styles.inputIcon} />
                      <input
                        type="number"
                        step="0.01"
                        name="rent"
                        value={selectedProperty.rent}
                        onChange={handleChange}
                        className={styles.inputField}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.inputLabel}>Price Type</label>
                    <div className={styles.inputWithIcon}>
                      <DollarSign className={styles.inputIcon} />
                      <select
                        name="price_type"
                        value={selectedProperty.price_type}
                        onChange={handleChange}
                        className={styles.selectField}
                      >
                        <option>Fixed</option>
                        <option>Negotiable</option>
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
                        value={selectedProperty.status}
                        className={styles.selectField}
                      >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.amenitiesSection}>
                    <h4 className={styles.amenitiesTitle}>Amenities</h4>
                    <div className={styles.amenitiesGrid}>
                      {[
                        { name: 'balcony_terrace', icon: Waves, label: 'Balcony/Terrace' },
                        { name: 'parking_space', icon: Car, label: 'Parking Space' },
                        { name: 'garden_yard', icon: Trees, label: 'Garden/Yard' },
                        { name: 'swimming_pool', icon: Waves, label: 'Swimming Pool' },
                        { name: 'lift_elevator', icon: ArrowUp, label: 'Lift/Elevator' },
                        { name: 'pet_friendly', icon: PawPrint, label: 'Pet Friendly' },
                      ].map(({ name, icon: Icon, label }) => (
                        <label key={name} className={styles.amenityCheckbox}>
                          <input
                            type="checkbox"
                            name={name}
                            checked={!!selectedProperty[name]}
                            onChange={handleChange}
                          />
                          <span className={styles.checkboxLabel}>
                            <Icon className={styles.amenityIcon} /> {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button variant="secondary" onClick={handleCloseModal} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} className={styles.deleteButton}>
              <Trash2 className={styles.buttonIcon} /> Delete Property
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave} 
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (
                <>
                  <Save className={styles.buttonIcon} /> Save Changes
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Success Toast */}
        {showSuccess && (
          <div className={styles.successToast}>
            <CheckCircle className={styles.successIcon} />
            <span>Changes saved successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;