import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, X, Check, Clock, Ban } from "lucide-react";
import "./ToursPopup.css";

const ToursPopup = () => {
  const [tourRequests, setTourRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTourRequests = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to view tour requests");
        return;
      }

      try {
        const params = {};
        if (filter !== "all") params.status = filter.toLowerCase();

        const res = await axios.get("http://localhost:8000/tenant-tour-requests/", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTourRequests(res.data);
      } catch (error) {
        console.error("Error fetching tour requests:", error);
        alert("Failed to load tour requests");
      } finally {
        setLoading(false);
      }
    };

    fetchTourRequests();
  }, [filter]);

  const handleCancel = async (tourRequestId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please log in to perform this action");
      return;
    }
  
    try {
      // Step 1: Update status to pending
      const updateResponse = await axios.patch(
        `http://localhost:8000/tour-requests/${tourRequestId}/`,
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
        if (window.confirm("Tour request cancelled. Delete permanently?")) {
          await axios.delete(
            `http://localhost:8000/tour-requests/${tourRequestId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setTourRequests(prev => prev.filter(tr => tr.id !== tourRequestId));
          alert("Tour request deleted successfully");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 403) {
        alert("You can only modify your own tour requests");
      } else {
        alert(error.response?.data?.error || "Failed to update tour request");
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case "accepted": return <Check className="icon accepted" />;
      case "declined": return <Ban className="icon declined" />;
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

  if (loading) return <div className="loading">Loading tour requests...</div>;

  return (
    <div className="tour-requests-popup">
      <h2><CalendarDays size={24} /> My Tour Requests</h2>
      
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
          className={filter === "declined" ? "active" : ""}
          onClick={() => setFilter("declined")}
        >
          Declined
        </button>
      </div>

      {tourRequests.length === 0 ? (
        <div className="no-tour-requests">
          No tour requests found {filter !== "all" ? `with status ${filter}` : ""}
        </div>
      ) : (
        <div className="tour-requests-list">
          {tourRequests.map((tourRequest) => (
            <div key={tourRequest.id} className={`custom-tour-request-box ${tourRequest.status.toLowerCase()}`}>
              <div className="custom-tour-request-wrapper">
                <div className="custom-tour-request-info">
                  <div className="custom-tour-request-header">
                    <h3>{tourRequest.property_title || "Unknown Property"}</h3>
                    <div className="custom-tour-request-status">
                      {getStatusIcon(tourRequest.status)}
                      <span>{tourRequest.status}</span>
                    </div>
                  </div>

                  <div className="custom-property-meta">
                    <span><strong>Owner:</strong> {tourRequest.owner_name || "Not specified"}</span>
                    <span><strong>Requested Date:</strong> {formatDate(tourRequest.requested_date)}</span>
                    <span><strong>Submitted:</strong> {new Date(tourRequest.time_submitted).toLocaleString()}</span>
                  </div>
                </div>

                <div className="custom-property-img-wrapper">
                  <img
                    src={tourRequest.property_image || '/placeholder-property.jpg'}
                    alt={tourRequest.property_title}
                    className="custom-property-img"
                  />
                </div>
              </div>

              <div className="custom-tour-request-footer">
                <div className="custom-tour-request-created">
                  Requested on {formatDate(tourRequest.time_submitted)}
                </div>

                {tourRequest.status.toLowerCase() === "pending" && (
                  <button
                    className="custom-cancel-btn"
                    onClick={() => handleCancel(tourRequest.id)}
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

export default ToursPopup;