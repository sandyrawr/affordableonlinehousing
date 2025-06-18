import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, MapPin, Bed, Bath, Users, DollarSign, 
  Edit, Trash2, Eye, User, Calendar 
} from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';
import styles from './ManageProperties.module.css';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:8000/properties/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [token]);

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const openDeleteModal = (property) => {
    setPropertyToDelete(property);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete?.id) {
      console.error('No property ID available for deletion:', propertyToDelete);
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/propad/${propertyToDelete.id}/delete/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setProperties(properties.filter((p) => p.id !== propertyToDelete.id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage All Properties</h2>
      <p className={styles.subtitle}>View and manage all listed properties</p>
      
      <div className={styles.propertyGrid}>
        {properties.map(property => (
          <div key={property.id} className={styles.propertyCard}>
            {property.property_image && (
              <div className={styles.imageContainer}>
                <img 
                  src={`http://localhost:8000${property.property_image}`} 
                  alt={property.title}
                  className={styles.propertyImage}
                />
              </div>
            )}
            <div className={styles.propertyContent}>
              <h3>{property.title}</h3>
              <div className={styles.detailRow}>
                <MapPin size={16} />
                <span>{property.location_name}</span>
              </div>
              <div className={styles.detailRow}>
                <User size={16} />
                <span>{property.owner_name}</span>
              </div>
              <div className={styles.detailRow}>
                <DollarSign size={16} />
                <span>${property.rent}/mo</span>
              </div>
              <div className={styles.buttonGroup}>
                <button 
                  className={styles.viewButton}
                  onClick={() => handleViewProperty(property)}
                >
                  <Eye size={16} /> View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Detail Modal */}
      {isModalOpen && selectedProperty && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{selectedProperty.title}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {selectedProperty.property_image && (
                <div className={styles.modalImageContainer}>
                  <img 
                    src={`http://localhost:8000${selectedProperty.property_image}`} 
                    alt={selectedProperty.title}
                    className={styles.modalImage}
                  />
                </div>
              )}
              
              <div className={styles.detailSection}>
                <h4>Basic Information</h4>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><User /> Owner:</span>
                    <span>{selectedProperty.owner_name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><MapPin /> Location:</span>
                    <span>{selectedProperty.location_name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Home /> Type:</span>
                    <span>{selectedProperty.property_type}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Bed /> Bedrooms:</span>
                    <span>{selectedProperty.bedrooms}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Bath /> Bathrooms:</span>
                    <span>{selectedProperty.bathrooms}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Users /> Max Occupants:</span>
                    <span>{selectedProperty.max_occupants}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><DollarSign /> Rent:</span>
                    <span>${selectedProperty.rent}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}><Calendar /> Date Added:</span>
                    <span>{new Date(selectedProperty.date_added).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.descriptionSection}>
                <h4>Description</h4>
                <p>{selectedProperty.description}</p>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                className={styles.deleteButton}
                onClick={() => openDeleteModal(selectedProperty)}
              >
                <Trash2 size={16} /> Delete Property
              </button>
              <button 
                className={styles.closeModalButton}
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this property?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteProperty}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageProperties;