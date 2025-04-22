import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, X, Check, Clock, Ban } from "lucide-react";
import "./BookingsPopup.css";

const BookingsPopup = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to view bookings");
        return;
      }

      try {
        const params = {};
        if (filter !== "all") params.status = filter.toLowerCase();

        const res = await axios.get("http://localhost:8000/tenant-bookings/", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        alert("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filter]);

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please log in to perform this action");
      return;
    }
  
    try {
      // Step 1: Update status to Cancelled
      const updateResponse = await axios.patch(
        `http://localhost:8000/bookings/${bookingId}/`,
        { status: "pending" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      if (updateResponse.data.status === "pending") {
        // Step 2: Offer to delete permanently
        if (window.confirm("Booking cancelled. Delete permanently?")) {
          await axios.delete(
            `http://localhost:8000/bookings/${bookingId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setBookings(prev => prev.filter(b => b.id !== bookingId));
          alert("Booking deleted successfully");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 403) {
        alert("You can only modify your own bookings");
      } else {
        alert(error.response?.data?.error || "Failed to update booking");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case "accepted": return <Check className="icon accepted" />;
      case "rejected": return <Ban className="icon rejected" />;
      case "pending": return <Clock className="icon pending" />;
      default: return <Clock className="icon pending" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Not specified" : date.toLocaleDateString();
    } catch {
      return "Not specified";
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-popup">
      <h2><CalendarDays size={24} /> My Booking Requests</h2>
      
      <div className="filter-controls">
        <button 
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button 
          className={filter === "accepted" ? "active" : ""}
          onClick={() => setFilter("accepted")}
        >
          Accepted
        </button>
        <button 
          className={filter === "rejected" ? "active" : ""}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          No bookings found {filter !== "all" ? `with status ${filter}` : ""}
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
        <div key={booking.id} className={`custom-booking-box ${booking.status.toLowerCase()}`}>
          <div className="custom-booking-wrapper">
            <div className="custom-booking-info">
              <div className="custom-booking-header">
              <h3>{booking.property_title || "Unknown Property"}</h3>
              <div className="custom-booking-status">
                {getStatusIcon(booking.status)}
                <span>{booking.status}</span>
              </div>
            </div>

        <div className="custom-property-meta">
          <span><strong>Owner:</strong> {booking.owner_name || "Not specified"}</span>
        </div>

        {booking.message && (
          <div className="custom-booking-message">
            <p>{booking.message}</p>
          </div>
        )}
      </div>

      <div className="custom-property-img-wrapper">
        <img
          src={booking.property_image || '/placeholder-property.jpg'}
          alt={booking.property_title}
          className="custom-property-img"
        />
      </div>
    </div>

    <div className="custom-booking-footer">
      <div className="custom-booking-created">
        Applied on {formatDate(booking.date_applied)}
      </div>

      {booking.status.toLowerCase() === "pending" && (
        <button
          className="custom-cancel-btn"
          onClick={() => handleCancel(booking.id)}
        >
          Cancel Request
        </button>
      )}
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default BookingsPopup;