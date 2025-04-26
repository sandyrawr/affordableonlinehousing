import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PropertyDetails.css";
import { Link, useLocation, NavLink } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import SafetyScaleBar from "../SafetyScaleBar/SafetyScaleBar";
import {
  Car, XCircle,
  Dumbbell, ArrowUpDown, WavesLadder,
  PawPrint,
  Home,
  Search,
  CalendarDays,
  MapPin,
  Users,
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
  const [currentOccupants, setCurrentOccupants] = useState([]);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [locationExpenses, setLocationExpenses] = useState(null);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        // Fetch property details
        const propRes = await axios.get(`http://localhost:8000/propertydetail/${id}/`);
        const prop = propRes.data;
        setProperty(prop);

        const locationRes = await axios.get(
          `http://localhost:8000/api/locationdetail/${prop.location}/`  // Updated URL
        );
        
        // 3. Merge safety_rating into property state
        setProperty(prev => ({
          ...prev,
          safetyrating: locationRes.data.safetyrating,
        }));
        
        // Fetch related properties
        const relatedRes = await axios.get(
          `http://localhost:8000/relatedproperties/?location=${prop.location}&status=true`
        );
        setRelatedProperties(relatedRes.data.filter(p => p.id !== prop.id));
        
        // Fetch current occupants if co-living
        if (prop.co_living) {
          const tenantsRes = await axios.get(
            `http://localhost:8000/api/property-tenants/${prop.id}/`
          );
          setCurrentOccupants(tenantsRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchPropertyData();
  }, [id]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
    setShowDropdown(false);
  };

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

  const showTenantDetails = (tenant) => {
    setSelectedTenant(tenant);
    setShowTenantModal(true);
  };

  // ... (keep all other existing functions unchanged) ...
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

  useEffect(() => {
    if (property?.location) {
      const fetchLocationExpenses = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/locationdetail/${property.location}/`);
          setLocationExpenses(res.data);
        } catch (err) {
          console.error("Error fetching location expenses:", err);
        }
      };
      fetchLocationExpenses();
    }
  }, [property]);

  // Toggle expense selection
  const toggleExpense = (expenseType) => {
    setSelectedExpenses(prev =>
      prev.includes(expenseType)
        ? prev.filter(item => item !== expenseType)
        : [...prev, expenseType]
    );
  };

  // Calculate total expenses
  const calculateTotal = () => {
    if (!locationExpenses) return 0;
    
    let total = 0;
    selectedExpenses.forEach(expense => {
      total += locationExpenses[expense] || 0;
    });
    setCalculatedTotal(total);
  };

  // Reset calculator when modal closes
  const handleCloseExpenseModal = () => {
    setShowExpenseModal(false);
    setSelectedExpenses([]);
    setCalculatedTotal(0);
  };

  if (!property) return <div className="text-center mt-5">Loading...</div>;


  return (
    <div className="container my-5">
      {/* Header and Navigation - keep this part exactly as is */}

      {/* Property Detail Section - FIXED: Removed duplicate section */}
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
            {property.co_living && <div className="d-flex align-items-center gap-1"><Users size={20} /> <span>Co-living</span></div>}
            {property.pet_friendly ? <div className="d-flex align-items-center gap-1"><PawPrint size={20} /> <span>Pet Friendly</span></div> : <div className="d-flex align-items-center gap-1 text-danger"><XCircle size={20} /> <span>No Pets</span></div>}
            {property.swimming_pool && <div className="d-flex align-items-center gap-1"><WavesLadder size={20} /> <span>Pool</span></div>}
            {property.lift_elevator && <div className="d-flex align-items-center gap-1"><ArrowUpDown size={20} /> <span>Elevator</span></div>}
          </div>

          
          {/* Property Details */}
          {property.owner && (
            <div className="d-flex align-items-center gap-2 mt-3">
              <img 
                src={`http://localhost:8000${property.owner_image}`}
                alt="Owner" 
                onClick={() => fetchOwner(property.owner)}  
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '60%', cursor: 'pointer' }} 
              />
            </div>
          )}

          {/* Safety Rating Scale - Add this new component */}
          <div className="safety-rating-container">
            <h5>Neighborhood Safety</h5>
            <div className="safety-scale" style={{
              height: '25px',
              backgroundColor: '#f0f0f0',
              borderRadius: '5px',
              overflow: 'hidden',
              position: 'relative',
              margin: '10px 0'
            }}>
              <div 
                className="safety-level" 
                style={{
                  width: `${((property.safetyrating || 0) / 10) * 100}%`,
                  backgroundColor: property.safetyrating 
                    ? `hsl(${property.safetyrating * 12}, 80%, 50%)`
                    : '#cccccc',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'width 0.3s ease'
                }}
              >
                <span className="rating-text" style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {property.safetyrating ? `${property.safetyrating.toFixed(1)}/10` : 'N/A'}
                </span>
              </div>
            </div>
          </div>         
           
          <p><strong>Type:</strong> {property.property_type}</p>
          <p><strong>Description:</strong> {property.description}</p>
          <p><strong>Location:</strong> {property.location_name}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p><strong>Max occupants:</strong> {property.max_occupants}</p>
          <p><strong>Floor Level:</strong> {property.floor_level}</p>
          <p><strong>Size:</strong> {property.property_size} sqm</p>

          <button 
          className="btn btn-primary ms-3"
          onClick={() => setShowExpenseModal(true)}
          style={{ whiteSpace: 'nowrap' }}
        >
          Calculate Expenses
        </button>

          {/* Tenants Living Section */}
          {property?.co_living && currentOccupants.length > 0 && (
            <div className="mt-4">
              <div className="d-flex flex-wrap gap-3">
                {currentOccupants.map(tenant => (
                  <div 
                    key={tenant.id} 
                    className="tenant-card"
                    onClick={() => setSelectedTenant(tenant)}
                  >
                    <img
                      src={`http://localhost:8000${tenant.user_image}`}
                      alt={tenant.name}
                      className="rounded-circle"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                    />
                    {/* <div className="tenant-info">
                      <strong>{tenant.name}</strong>
                      <small>Since {new Date(tenant.check_in).toLocaleDateString()}</small>
                    </div> */}
                  </div>
                ))}
              </div>
              <h5>Tenants Living ({currentOccupants.length}/{property.max_occupants})</h5>
            </div>
          )}

          {/* Booking & Tour Section */}
          <div className="d-flex flex-column flex-md-row gap-3 mt-4">
            <div className="d-flex border rounded p-3 flex-grow-1" style={{ flex: 3 }}>
              <div className="me-3 w-100">
                <h5>Rent({property.price_type})</h5>
                <h3>${property.rent}</h3>
                {/* <p>{property.price_type}</p> */}
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

      {/* Modals */}
      {selectedTenant && (
          <Modal show={!!selectedTenant} onHide={() => setSelectedTenant(null)}>
            <Modal.Header closeButton>
              <Modal.Title>Tenant Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <img
                  src={`http://localhost:8000${selectedTenant.user_image}`}
                  alt={selectedTenant.name}
                  className="rounded-circle mb-3"
                  style={{ width: '100px', height: '100px' }}
                />
                <h4>{selectedTenant.name}</h4>
                <p><strong>Phone:</strong> {selectedTenant.phone_number}</p>
                <p><strong>Move-in Date:</strong> {new Date(selectedTenant.check_in).toLocaleDateString()}</p>
                <p><strong>Employment Status:</strong> {selectedTenant.employment_status ? 'Employed' : 'Not Employed'}</p>
                <p><strong>Criminal History:</strong> {selectedTenant.criminal_history ? 'Yes' : 'No'}</p>
              </div>
            </Modal.Body>
          </Modal>
        )}

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


      {/* Expense Calculation Modal */}
      {showExpenseModal && (
            <div className="modal-backdrop" style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div className="modal-content bg-white p-4 rounded" style={{
                width: '90%',
                maxWidth: '500px'
              }}>
                <h4>Monthly Expense Calculator</h4>
                <p>Select all expenses that apply to you:</p>
                
                {locationExpenses && (
                  <div className="mb-3">
                    {[
                      { key: 'transportcost', label: 'Transportation' },
                      { key: 'utilitycost', label: 'Utilities' },
                      { key: 'foodcost', label: 'Food' },
                      { key: 'entertainmentcost', label: 'Entertainment' },
                      { key: 'healthcarecost', label: 'Healthcare' },
                      { key: 'clothingcost', label: 'Clothing' },
                      { key: 'pethealthcost', label: 'Pet Care' }
                    ].map(item => (
                      <div key={item.key} className="form-check mb-2">
                        <input
                          type="checkbox"
                          id={item.key}
                          className="form-check-input"
                          checked={selectedExpenses.includes(item.key)}
                          onChange={() => toggleExpense(item.key)}
                        />
                        <label htmlFor={item.key} className="form-check-label">
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                <button 
                  className="btn btn-primary me-2"
                  onClick={calculateTotal}
                  disabled={selectedExpenses.length === 0}
                >
                  Calculate Total
                </button>

                {calculatedTotal > 0 && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <h5>Your estimated monthly expenses:</h5>
                    <p className="fs-4">Rs {calculatedTotal}</p>
                  </div>
                )}

                <button 
                  className="btn btn-secondary mt-3"
                  onClick={handleCloseExpenseModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}

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