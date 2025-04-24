import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import styles from "./MyRentedSpaces.module.css";
import { 
  Home, Users, Calendar, User, Trash2, X, Check, MapPin, Bed, Bath
} from 'lucide-react';

const MyRentedSpaces = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchRentedProperties = async () => {
      try {
        const response = await axios.get("http://localhost:8000/owner-rented-properties/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(response.data);
      } catch (err) {
        console.error("Failed to fetch rented properties:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
      }
    };

    fetchRentedProperties();
  }, [token]);

  const fetchPropertyOccupants = async (propertyId) => {
    try {
      const response = await axios.get(`http://localhost:8000/property-occupants/${propertyId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.error("Failed to fetch occupants:", err);
      return [];
    }
  };

  const handleOpenModal = async (property) => {
    setIsLoading(true);
    const occupants = await fetchPropertyOccupants(property.id);
    setSelectedProperty({
      ...property,
      occupants
    });
    setShowModal(true);
    setIsLoading(false);
  };

  const handleRemoveTenant = async (occupancyId) => {
    if (!window.confirm("Are you sure you want to remove this tenant?")) return;
    
    try {
      await axios.delete(`http://localhost:8000/occupancy/${occupancyId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the occupants list
      const updatedOccupants = await fetchPropertyOccupants(selectedProperty.id);
      setSelectedProperty(prev => ({
        ...prev,
        occupants: updatedOccupants
      }));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to remove tenant:", err);
      alert("Failed to remove tenant. Please try again.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.propertiesContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>My Rented Spaces</h2>
          <p className={styles.subtext}>Properties currently occupied by tenants</p>
        </div>

        <div className={styles.propertyGrid}>
          {properties.map((property) => (
            <div 
              key={property.id} 
              className={styles.propertyCard}
              onClick={() => handleOpenModal(property)}
            >
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
                  <span>{property.location_name}</span>
                </div>
                <div className={styles.detailItem}>
                  <Bed className={styles.detailIcon} />
                  <span>{property.bedrooms} beds</span>
                </div>
                <div className={styles.detailItem}>
                  <Bath className={styles.detailIcon} />
                  <span>{property.bathrooms} baths</span>
                </div>
                <div className={styles.occupancyInfo}>
                  <Users className={styles.detailIcon} />
                  <span>
                    {property.current_occupants}/{property.max_occupants} occupants
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <Calendar className={styles.detailIcon} />
                  <span>Added: {new Date(property.date_added).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Occupants Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg"
          centered
          backdropClassName={styles.modalBackdrop}
        >
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              <Users className={styles.modalTitleIcon} /> 
              {selectedProperty?.title} - Current Occupants
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            {isLoading ? (
              <div className={styles.loading}>Loading occupants...</div>
            ) : (
              <div className={styles.occupantsList}>
                {selectedProperty?.occupants?.length > 0 ? (
                  selectedProperty.occupants.map(occupant => (
                    <div key={occupant.id} className={styles.occupantCard}>
                      <div className={styles.occupantImage}>
                        <img
                          src={occupant.tenant.user_image 
                            ? `http://localhost:8000${occupant.tenant.user_image}`
                            : '/default-avatar.png'
                          }
                          alt={occupant.tenant.name}
                        />
                      </div>
                      <div className={styles.occupantInfo}>
                        <h4>{occupant.tenant.name}</h4>
                        <p>Phone: {occupant.tenant.phone_number}</p>
                        <p>Moved in: {new Date(occupant.check_in).toLocaleDateString()}</p>
                      </div>
                      <div className={styles.occupantActions}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveTenant(occupant.id)}
                          className={styles.removeButton}
                        >
                          <Trash2 size={16} /> Remove
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noOccupants}>
                    <X size={24} />
                    <p>No current occupants</p>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button 
              variant="secondary" 
              onClick={() => setShowModal(false)}
              className={styles.closeButton}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Success Toast */}
        {showSuccess && (
          <div className={styles.successToast}>
            <Check className={styles.successIcon} />
            <span>Tenant removed successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentedSpaces;