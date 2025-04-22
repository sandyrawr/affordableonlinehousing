import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Clock, CheckCircle, XCircle, User, Home, MessageSquare,
  Calendar, Check, X, Filter
} from 'lucide-react';
import styles from "./TourRequests.module.css";

const TourRequests = () => {
  const [tourRequests, setTourRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTourRequests = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("You must be logged in to view tour requests.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/all-tours/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTourRequests(res.data);
        setFilteredRequests(res.data);
      } catch (error) {
        console.error("❌ Error fetching tour requests:", error);
      }
    };

    fetchTourRequests();
  }, []);

  const handleFilter = (status) => {
    setActiveFilter(status);
    if (status === 'all') {
      setFilteredRequests(tourRequests);
    } else {
      setFilteredRequests(tourRequests.filter(tour => tour.status === status));
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `http://localhost:8000/updatetours/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedRequests = tourRequests.map(tour =>
        tour.id === id ? { ...tour, status } : tour
      );
      setTourRequests(updatedRequests);
      setFilteredRequests(updatedRequests.filter(tour => 
        activeFilter === 'all' || tour.status === activeFilter
      ));
    } catch (error) {
      console.error(`❌ Error updating tour status:`, error);
    }
  };

  const fetchTenantDetails = async (tenantId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`http://localhost:8000/tenantdet/${tenantId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTenantDetails(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("❌ Error fetching tenant details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTenantDetails(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#4CAF50'; // Green
      case 'declined':
        return '#F44336'; // Red
      default:
        return '#FFC107'; // Yellow (pending)
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'declined':
        return <XCircle size={16} color="#F44336" />;
      default:
        return <Clock size={16} color="#FFC107" />;
    }
  };

  return (
    <div className={styles.tourRequestsContainer}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.pageTitle}>Tour Requests</h2>
        
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => handleFilter('all')}
          >
            <Filter size={16} className={styles.icon} /> All
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'pending' ? styles.active : ''}`}
            onClick={() => handleFilter('pending')}
          >
            <Clock size={16} className={styles.icon} /> Pending
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'accepted' ? styles.active : ''}`}
            onClick={() => handleFilter('accepted')}
          >
            <CheckCircle size={16} className={styles.icon} /> Accepted
          </button>
          <button 
            className={`${styles.filterButton} ${activeFilter === 'declined' ? styles.active : ''}`}
            onClick={() => handleFilter('declined')}
          >
            <XCircle size={16} className={styles.icon} /> Declined
          </button>
        </div>
        
        {filteredRequests.length === 0 ? (
          <p className={styles.noRequests}>No {activeFilter === 'all' ? '' : activeFilter} tour requests found.</p>
        ) : (
          <div className={styles.tourCardsContainer}>
            {filteredRequests.map((tour) => (
              <div 
                key={tour.id} 
                className={styles.tourCard}
                style={{ borderLeft: `5px solid ${getStatusColor(tour.status)}` }}
              >
                <div className={styles.tourLeft}>
                  <div className={styles.propertyTitle}>
                    <Home size={16} className={styles.icon} />
                    {tour.property_title} ({tour.property_type})
                  </div>
                  
                  <div className={styles.tenantInfo} onClick={() => fetchTenantDetails(tour.tenant)}>
                    <img
                      src={`http://localhost:8000${tour.tenant_image}`}
                      alt="Tenant"
                      className={styles.tenantImage}
                    />
                    <div className={styles.tenantName}>{tour.tenant_name}</div>
                  </div>
                  
                  <div className={styles.tourDate}>
                    <Calendar size={16} className={styles.icon} />
                    Requested: {new Date(tour.requested_date).toLocaleDateString()}
                  </div>
                  
                  <div className={styles.submittedDate}>
                    <Calendar size={16} className={styles.icon} />
                    Applied: {new Date(tour.time_submitted).toLocaleDateString()}
                  </div>
                </div>
                
                <div className={styles.tourRight}>
                  <div className={styles.statusImageWrapper}>
                    <div className={styles.statusIndicator}>
                      {getStatusIcon(tour.status)}
                      <span style={{ color: getStatusColor(tour.status) }}>
                        {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                      </span>
                    </div>
                    <div className={styles.propertyImageContainer}>
                      <img
                        src={tour.property_image}
                        alt={tour.property_title}
                        className={styles.propertyImage}
                      />
                    </div>
                  </div>
                </div>
                
                {tour.status === 'pending' && (
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.acceptButton}
                      onClick={() => handleStatusUpdate(tour.id, "accepted")}
                    >
                      <Check size={16} /> Accept
                    </button>
                    <button 
                      className={styles.rejectButton}
                      onClick={() => handleStatusUpdate(tour.id, "declined")}
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tenant Details Modal */}
        {isModalOpen && tenantDetails && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button onClick={closeModal} className={styles.closeButton}>
                &times;
              </button>
              
              <div className={styles.tenantModalContent}>
                <img
                  src={tenantDetails.user_image}
                  alt={tenantDetails.name}
                  className={styles.modalTenantImage}
                />
                
                <h3 className={styles.tenantName}>{tenantDetails.name}</h3>
                
                <div className={styles.tenantDetails}>
                  <div className={styles.detailItem}>
                    <strong>Phone Number:</strong> {tenantDetails.phone_number}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Criminal History:</strong> 
                    <span className={tenantDetails.criminal_history ? styles.badgeDanger : styles.badgeSuccess}>
                      {tenantDetails.criminal_history ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <strong>Employment Status:</strong> 
                    <span className={tenantDetails.employment_status ? styles.badgeSuccess : styles.badgeWarning}>
                      {tenantDetails.employment_status ? "Employed" : "Unemployed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourRequests;