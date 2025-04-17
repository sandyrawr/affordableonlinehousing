import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Bookings.css"; // Optional CSS file
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

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

  return (
    <div className="container my-5">
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="booking-card d-flex border rounded p-3 mb-4 shadow align-items-center justify-content-between"
          >
            {/* Left: Property Image */}
            <div className="property-img me-4" style={{ width: "200px" }}>
              <img
                src={booking.property_image}
                alt={booking.property_title}
                className="img-fluid rounded"
              />
            </div>

            {/* Center: Booking Info */}
            <div className="booking-info flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <img
                  src={`http://localhost:8000${booking.tenant_image}`}
                  alt="Tenant"
                  onClick={() => fetchTenantDetails(booking.tenant)} // Fetch tenant details
                  className="rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    cursor: "pointer",
                    marginRight: "15px",
                  }}
                />
                <div>
                  <strong>{booking.tenant_name}</strong>
                  <div className="text-muted">{booking.property_title}</div>
                </div>
              </div>
              <p>{booking.message}</p>
              <p className="text-muted">
                <small>
                  Status: {booking.status} | Applied:{" "}
                  {new Date(booking.date_applied).toLocaleString()}
                </small>
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="d-flex flex-column align-items-end">
              {/* Conditionally render buttons based on booking status */}
              {booking.status !== "Accepted" && booking.status !== "Rejected" && (
                <>
                  <button
                    className="btn btn-success mb-2"
                    onClick={() => handleStatusUpdate(booking.id, "Accepted")}
                    disabled={booking.status === "Accepted"}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate(booking.id, "Rejected")}
                    disabled={booking.status === "Rejected"}
                  >
                    ❌ Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      {/* Tenant Details Modal */}
      {isModalOpen && tenantDetails && (
        <div className="tenant-modal-overlay">
          <div className="tenant-modal">
            <button onClick={closeModal} className="btn-close">
              &times;
            </button>
            <div className="tenant-details">
              <img
                src={tenantDetails.user_image}
                alt={tenantDetails.name}
                className="img-fluid rounded-circle"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              />
              <h3>{tenantDetails.name}</h3>
              <p><strong>Phone Number:</strong> {tenantDetails.phone_number}</p>
              <p><strong>Criminal History:</strong> {tenantDetails.criminal_history ? "Yes" : "No"}</p>
              <p><strong>Employment Status:</strong> {tenantDetails.employment_status ? "Employed" : "Unemployed"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
