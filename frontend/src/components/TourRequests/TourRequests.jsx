import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TourRequests.css";
import { useNavigate } from "react-router-dom";

const TourRequests = () => {
  const [tourRequests, setTourRequests] = useState([]);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      } catch (error) {
        console.error("❌ Error fetching tour requests:", error);
      }
    };

    fetchTourRequests();
  }, []);

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
      setTourRequests((prev) =>
        prev.map((tour) =>
          tour.id === id ? { ...tour, status } : tour
        )
      );
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

  return (
    <div className="container my-5">
      <h2>Tour Requests</h2>
      {tourRequests.length === 0 ? (
        <p>No tour requests found.</p>
      ) : (
        tourRequests.map((tour) => (
          <div
            key={tour.id}
            className="tour-card d-flex border rounded p-3 mb-4 shadow align-items-center justify-content-between"
          >
            {/* Left: Property Image */}
            <div className="property-img me-4" style={{ width: "200px" }}>
              <img
                src={tour.property_image}
                alt={tour.property_title}
                className="img-fluid rounded"
              />
            </div>

            {/* Center: Tour Info */}
            <div className="tour-info flex-grow-1">
              <div className="d-flex align-items-center mb-2">
                <img
                  src={`http://localhost:8000${tour.tenant_image}`}
                  alt="Tenant"
                  onClick={() => fetchTenantDetails(tour.tenant)}
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
                  <strong>{tour.tenant_name}</strong>
                  <div className="text-muted">
                    {tour.property_title} ({tour.property_type})
                  </div>
                </div>
              </div>

              <div className="mb-2">
                Requested tour date:{" "}
                <strong>{new Date(tour.requested_date).toLocaleDateString()}</strong>
              </div>

              <p className="text-muted">
                <small>
                  Status: {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)} |{" "}
                  Applied: {new Date(tour.time_submitted).toLocaleString()}
                </small>
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="d-flex flex-column align-items-end">
              {tour.status !== "confirmed" && tour.status !== "declined" && (
                <>
                  <button
                    className="btn btn-success mb-2"
                    onClick={() => handleStatusUpdate(tour.id, "confirmed")}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate(tour.id, "declined")}
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
            <button onClick={closeModal} className="btn-close">&times;</button>
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

export default TourRequests;
