import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PropertyDetails.css";
import { Link, useLocation, NavLink } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import {
  Car, Trees, XCircle,
  Dumbbell, ArrowUpDown, WavesLadder,
  PawPrint,
  User,
  Home,
  Search,
  CalendarDays,
  MapPin,
} from "lucide-react";



const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [tourDate, setTourDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [owner, setOwner] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
    // useEffect(() => {
    //   const handleClickOutside = (event) => {
    //     if (!event.target.closest('.profile-dropdown')) {
    //       setShowDropdown(false);
    //     }
    //   };
  
    //   document.addEventListener('mousedown', handleClickOutside);
    //   return () => {
    //     document.removeEventListener('mousedown', handleClickOutside);
    //   };
    // }, []);
  
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
    setShowDropdown(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:8000/propertydetail/${id}/`)
      .then((res) => {
        const prop = res.data;
        setProperty(prop);
        axios.get(`http://localhost:8000/relatedproperties/?location=${prop.location}&status=true`)
          .then((relatedRes) => {
            const others = relatedRes.data.filter(p => p.id !== prop.id);
            setRelatedProperties(others);
          })
          .catch(err => console.error("❌ Failed to fetch related properties:", err));
      })
      .catch((err) => console.error("❌ Failed to fetch property:", err));
  }, [id]);

  const fetchOwner = async (ownerId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`http://localhost:8000/owner-detail/${ownerId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setOwner(res.data);
      setShowOwnerModal(true);
    } catch (err) {
      console.error("Failed to fetch owner:", err);
    }
  };

  const checkBookingStatus = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`http://localhost:8000/check-booking-status/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("❌ Failed to check booking status:", err);
      return { status: "error", message: "Failed to check booking status." };
    }
  };

  const checkTourRequestStatus = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`http://localhost:8000/check-tour-request-status/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("❌ Failed to check tour request status:", err);
      return { status: "error", message: "Failed to check tour request status." };
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to book a property.");
      return;
    }
  
    const bookingStatus = await checkBookingStatus();
    
    // Convert both to lowercase for case-insensitive comparison
    const currentStatus = bookingStatus.status?.toLowerCase();
    
    // Check all statuses that should prevent re-booking
    if (currentStatus === "accepted" || currentStatus === "approved") {
      alert("You have already booked this property.");
      return;
    } else if (currentStatus === "pending") {
      alert("Your booking request is already pending.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/bookings/", {
        property: property.id,
        message: "Booking requested from property detail page",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("✅ Booking request submitted!");
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err.message);
      alert(`❌ Failed to submit booking: ${err.response?.data?.detail || "Please try again"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTourRequest = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to request a tour.");
      return;
    }

    const bookingStatus = await checkBookingStatus();
    if (bookingStatus.status === "approved") {
      alert("You have already booked this property. No need to request a tour.");
      return;
    }

    const tourStatus = await checkTourRequestStatus();
    if (tourStatus.status === "confirmed") {
      alert("Your tour request has already been confirmed.");
      return;
    } else if (tourStatus.status === "pending") {
      alert("Your tour request is pending.");
      return;
    }

    if (!tourDate) {
      alert("Please select a tour date.");
      return;
    }

    const selectedDate = new Date(tourDate);
    const today = new Date();
    if (selectedDate <= today) {
      alert("Please select a date after today.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/tour-requests/", {
        property: property.id,
        requested_date: tourDate,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("✅ Tour request submitted!");
    } catch (err) {
      console.error("❌ Tour request error:", err.response?.data || err.message);
      alert("❌ Failed to request tour. Please check your login status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!property) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="top-section">
        {/* Left side - Logo */}
        <div className="logo-container">
          <h1 className="logo-text">RENTABLE</h1>
        </div>

        {/* Right side - Navigation and Profile */}
        <div className="nav-right">
        <nav className="main-nav">
          <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>
            <Home size={18} className="nav-icon" /> Home
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
            <Search size={18} className="nav-icon" /> Search
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => isActive ? 'active' : ''}>
            <CalendarDays size={18} className="nav-icon" /> My Bookings
          </NavLink>
          <NavLink to="/tours" className={({ isActive }) => isActive ? 'active' : ''}>
            <MapPin size={18} className="nav-icon" /> My Tours
          </NavLink>
        </nav>
          
          <div className="profile-dropdown">
            <button className="profile-btn" onClick={toggleDropdown}>
              <User size={24} />
            </button>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                minWidth: '180px',
                backgroundColor: 'white',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 1000,
                border: '1px solid #e5e7eb',
                padding: '8px 0'
              }}>
                <Link 
                  to="/tenantprofile" 
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    color: '#333',
                    textDecoration: 'none'
                  }}
                  onClick={() => setShowDropdown(false)}
                >
                  Edit Profile
                </Link>
                <button 
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 16px',
                    background: 'none',
                    border: 'none',
                    color: '#333',
                    cursor: 'pointer'
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Property Detail Section */}
      <div className="d-flex flex-column flex-md-row border p-4 rounded shadow-lg property-detail-container">
        <div className="col-md-6">
          <img
            src={`http://localhost:8000${property.property_image}`}
            alt={property.title}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6 ps-md-4 pt-3 pt-md-0">
          <h2>{property.title}</h2>

          <div className="d-flex flex-wrap gap-3 align-items-center my-3">
            {property.parking_space && <div className="d-flex align-items-center gap-1"><Car size={20} /> <span>Parking</span></div>}
            {property.co_living && <div className="d-flex align-items-center gap-1"><Trees size={20} /> <span>Co-living</span></div>}
            {property.pet_friendly ? <div className="d-flex align-items-center gap-1"><PawPrint size={20} /> <span>Pet Friendly</span></div> : <div className="d-flex align-items-center gap-1 text-danger"><XCircle size={20} /> <span>No Pets</span></div>}
            {/* {property.gym && <div className="d-flex align-items-center gap-1"><Dumbbell size={20} /> <span>Gym</span></div>} */}
            {property.swimming_pool && <div className="d-flex align-items-center gap-1"><WavesLadder size={20} /> <span>Pool</span></div>}
            {property.lift_elevator && <div className="d-flex align-items-center gap-1"><ArrowUpDown size={20} /> <span>Elevator</span></div>}
          </div>

          {property.owner && (
            <div className="d-flex align-items-center gap-2 mt-3">
              <img 
                src={`http://localhost:8000${property.owner_image}`}
                alt="Owner" 
                onClick={() => fetchOwner(property.owner)}  
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '60%', cursor: 'pointer', }} 
              />
            </div>
          )}

          <p><strong>Type:</strong> {property.property_type}</p>
          <p><strong>Description:</strong> {property.description}</p>
          <p><strong>Location:</strong> {property.location_name}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p><strong>Max occupants:</strong> {property.max_occupants}</p>
          <p><strong>Floor Level:</strong> {property.floor_level} / {property.max_occupants}</p>
          <p><strong>Size:</strong> {property.property_size} sqm</p>

          <Modal show={showOwnerModal} onHide={() => setShowOwnerModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Owner Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {owner ? (
                <div className="text-center">
                  <img
                    src={`http://localhost:8000${property.owner_image}`}
                    alt={owner.name}
                    style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }}
                  />
                  <h5>{owner.name}</h5>
                  <p><strong>Phone:</strong> {owner.phone_number}</p>
                  <p><strong>Employed:</strong> {owner.employment_status ? "Yes" : "No"}</p>
                  <p><strong>Criminal History:</strong> {owner.criminal_history ? "Yes" : "No"}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowOwnerModal(false)}>Close</Button>
            </Modal.Footer>
          </Modal>

          {/* Booking & Tour Request */}
          <div className="d-flex flex-column flex-md-row gap-3 mt-4">
            <div className="d-flex border rounded p-3 flex-grow-1" style={{ flex: 3 }}>
              <div className="me-3 w-100">
                <h5>Rent</h5>
                <h3>${property.rent}</h3>
                <p>{property.price_type}</p>
              </div>
              <div className="d-flex align-items-end w-100">
                <button className="btn btn-primary w-100" onClick={handleBooking} disabled={isSubmitting}>
                  {isSubmitting ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>

            <div className="border rounded p-3" style={{ flex: 2, minWidth: "200px" }}>
              <h5>Request Tour</h5>
              <input
                type="date"
                value={tourDate}
                onChange={(e) => setTourDate(e.target.value)}
                className="form-control mb-2"
              />
              <button className="btn btn-secondary w-100" onClick={handleTourRequest} disabled={isSubmitting}>
                {isSubmitting ? "Requesting..." : "Request Tour"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {relatedProperties.length > 0 && (
        <div className="mt-5">
          <h4>Other Properties in {property.location_name}</h4>
          <div className="row mt-3">
            {relatedProperties.map((prop) => (
              <div
                key={prop.id}
                className="col-md-4 mb-4 clickable-card"
                onClick={() => navigate(`/propertydetails/${prop.id}`)}
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={`http://localhost:8000${prop.property_image}`}
                    className="card-img-top"
                    alt={prop.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{prop.title}</h5>
                    <p className="card-text">
                      <strong>Rent:</strong> ${prop.rent} ({prop.price_type})<br />
                      <strong>Type:</strong> {prop.property_type}<br />
                      <strong>Bedrooms:</strong> {prop.bedrooms}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;