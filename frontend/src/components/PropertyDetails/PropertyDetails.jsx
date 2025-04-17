import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PropertyDetails.css";
import {
  Car, Trees, PawPrint, XCircle,
  Dumbbell, ArrowUpDown, WavesLadder
} from "lucide-react";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [tourDate, setTourDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("access");

  useEffect(() => {
    axios.get(`http://localhost:8000/propertydetail/${id}/`)
      .then((res) => {
        const prop = res.data;
        setProperty(prop);
        axios.get(`http://localhost:8000/relatedproperties/?location=${prop.location}`)
          .then((relatedRes) => {
            const others = relatedRes.data.filter(p => p.id !== prop.id);
            setRelatedProperties(others);
          })
          .catch(err => console.error("❌ Failed to fetch related properties:", err));
      })
      .catch((err) => console.error("❌ Failed to fetch property:", err));
  }, [id]);

  const handleBooking = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to book a property.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/bookings/", {
        property: property.id,
        message: "Booking requested from property detail page"
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      alert("✅ Booking request submitted!");
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err.message);
      alert("❌ Failed to submit booking. Please check your login status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTourRequest = async () => {
    const token = localStorage.getItem("accessToken");

    if (!tourDate) {
      alert("Please select a tour date.");
      return;
    }

    if (!token) {
      alert("You must be logged in to request a tour.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:8000/tour-requests/", {
        property: property.id,
        requested_date: tourDate
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
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
            {property.garden_yard && <div className="d-flex align-items-center gap-1"><Trees size={20} /> <span>Garden</span></div>}
            {property.pet_friendly ? <div className="d-flex align-items-center gap-1"><PawPrint size={20} /> <span>Pet Friendly</span></div> : <div className="d-flex align-items-center gap-1 text-danger"><XCircle size={20} /> <span>No Pets</span></div>}
            {property.gym && <div className="d-flex align-items-center gap-1"><Dumbbell size={20} /> <span>Gym</span></div>}
            {property.swimming_pool && <div className="d-flex align-items-center gap-1"><WavesLadder size={20} /> <span>Pool</span></div>}
            {property.lift_elevator && <div className="d-flex align-items-center gap-1"><ArrowUpDown size={20} /> <span>Elevator</span></div>}
          </div>

          <p><strong>Type:</strong> {property.property_type}</p>
          <p><strong>Description:</strong> {property.description}</p>
          <p><strong>Location:</strong> {property.location_name}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          <p><strong>Total Rooms:</strong> {property.total_rooms}</p>
          <p><strong>Floor Level:</strong> {property.floor_level} / {property.total_floors}</p>
          <p><strong>Size:</strong> {property.property_size} sqm</p>

          {/* Booking & Tour Request */}
          <div className="d-flex flex-column flex-md-row gap-3 mt-4">
            {/* Rent + Book Now */}
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

            {/* Request Tour */}
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

      {/* Related Properties Section */}
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
