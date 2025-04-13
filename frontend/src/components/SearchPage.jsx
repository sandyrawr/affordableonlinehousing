import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";  // Hook to read query parameters
import "./SearchPage.css";
import { Link } from "react-router-dom"; // Add this import

const SearchPage = () => {
  const [properties, setProperties] = useState([]);
  const location = useLocation();  // Get the current location from the URL
  const searchParams = new URLSearchParams(location.search);  // Extract query parameters
  const locationName = searchParams.get("location");  // Get the 'location' param

  useEffect(() => {
    if (locationName) {
      axios.get(`http://localhost:8000/properties/?location=${encodeURIComponent(locationName)}`)
        .then(response => setProperties(response.data))
        .catch(error => console.error("Error fetching properties:", error));
    }
  }, [locationName]);  // Re-run effect if location changes

  return (
    <div className="container py-5">
      {/* Top Section: Logo on the left, Profile button on the right */}
      <div className="top-section">
        <img src="./locations/logo.png" alt="Logo" className="logo" />
        <Link to="/profile" className="btn btn-outline-primary profile-btn">Profile</Link>
      </div>

      {/* Centered Top Text with Subtext */}
      <div className="text-center mb-4">
        <h2 className="top-title">Search Properties in {locationName}</h2>
        <p className="top-subtext">Find your dream home or office here in {locationName}.</p>
        
        {/* Conditionally render no properties message */}
        {properties.length === 0 && (
          <p className="no-properties-found">No properties found in {locationName}.</p>
        )}
      </div>

      {/* Property Gallery Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {properties.map(property => (
          <div key={property.id} className="col d-flex align-items-stretch">
            <Link
              to={`/property/${property.id}`}
              className="w-100 text-decoration-none"
            >
              <div className="card property-card shadow-sm w-100 overflow-hidden">
                <div className="img-container">
                  <img
                    src={`http://localhost:8000${property.property_image}`}
                    alt={property.title}
                    className="card-img-top property-img"
                  />
                </div>
                <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center text-white property-overlay">
                  <h5 className="property-title">{property.title}</h5>
                  <span className="property-subtext">{property.property_type}</span>
                  <span className="property-price">${property.rent}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
