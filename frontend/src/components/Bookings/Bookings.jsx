import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Clock, CheckCircle, XCircle, User, Home, MessageSquare,
  Calendar, Check, X, MoreVertical, Filter 
} from 'lucide-react';
import styles from "./Bookings.module.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredBookings, setFilteredBookings] = useState([]); // Fixed case to match usage


  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("You must be logged in to view bookings.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/owner-bookings/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setBookings(res.data);
        setFilteredBookings(res.data);
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleFilter = (status) => {
    setActiveFilter(status);
    if (status === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === status));
    }
  };

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `http://localhost:8000/updatebookings/${id}/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );

      setFilteredBookings(prev => 
        prev.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        )
      );

    } catch (error) {
      console.error(`❌ Error updating booking status:`, error);
    }
  };

  const fetchTenantDetails = async (tenantId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`http://localhost:8000/tenantdet/${tenantId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
      case 'rejected':
        return '#F44336'; // Red
      default:
        return '#FFC107'; // Yellow (pending)
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'rejected':
        return <XCircle size={16} color="#F44336" />;
      default:
        return <Clock size={16} color="#FFC107" />;
    }
  };

  return (
    <div className={styles.bookingsContainer}>
      <h2 className={styles.pageTitle}>Booking Requests</h2>
      
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
            className={`${styles.filterButton} ${activeFilter === 'rejected' ? styles.active : ''}`}
            onClick={() => handleFilter('rejected')}
          >
            <XCircle size={16} className={styles.icon} /> Rejected
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <p className={styles.noBookings}>No {activeFilter === 'all' ? '' : activeFilter} bookings found.</p>
        ) : (
        <div className={styles.bookingCardsContainer}>
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className={styles.bookingCard}
              style={{ borderLeft: `5px solid ${getStatusColor(booking.status)}` }}
            >
              <div className={styles.bookingLeft}>
                <div className={styles.propertyTitle}>
                  <Home size={16} className={styles.icon} />
                  {booking.property_title}
                </div>
                <div className={styles.statusIndicator}>
                  {getStatusIcon(booking.status)}
                  <span style={{ color: getStatusColor(booking.status) }}>
                    {booking.status}
                  </span>
                </div>
                
                <div className={styles.tenantInfo} onClick={() => fetchTenantDetails(booking.tenant)}>
                  <img
                    src={`http://localhost:8000${booking.tenant_image}`}
                    alt="Tenant"
                    className={styles.tenantImage}
                  />
                  <div className={styles.tenantName}>{booking.tenant_name}</div>
                </div>
                
                <div className={styles.message}>
                  <MessageSquare size={16} className={styles.icon} />
                  {booking.message}
                </div>
                
                <div className={styles.appliedDate}>
                  <Calendar size={16} className={styles.icon} />
                  Applied: {new Date(booking.date_applied).toLocaleDateString()}
                </div>
              </div>
              
              <div className={styles.bookingRight}>

                <div className={styles.propertyImageContainer}>
                  <img
                    src={booking.property_image}
                    alt={booking.property_title}
                    className={styles.propertyImage}
                  />
                </div>
               
              </div>
              
              {booking.status === 'pending' && (
                <div className={styles.actionButtons}>
                  <button 
                    className={styles.acceptButton}
                    onClick={() => handleStatusUpdate(booking.id, "accepted")}
                  >
                    <Check size={16} /> Accept
                  </button>
                  <button 
                    className={styles.rejectButton}
                    onClick={() => handleStatusUpdate(booking.id, "rejected")}
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
  );
};

export default Bookings;