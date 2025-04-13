// MyProperties.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css"; // Reuse your home styles
import { Link } from "react-router-dom";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // JWT from login
    axios.get("http://localhost:8000/my-properties/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => setProperties(response.data))
    .catch((error) => console.error("Error fetching your properties:", error));
  }, []);

  return (
    <div className="container py-5">
      <div className="top-section">
        <img src="./locations/logo.png" alt="Logo" className="logo" />
        <Link to="/profile" className="btn btn-outline-primary profile-btn">Profile</Link>
      </div>

      <div className="text-center mb-4">
        <h2 className="top-title">My Properties</h2>
        <p className="top-subtext">Here are all the properties you've listed.</p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center text-muted mt-5">You haven't added any properties yet.</div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {properties.map((property) => (
            <div key={property.id} className="col d-flex align-items-stretch">
              <Link to={`/property/${property.id}`} className="w-100 text-decoration-none">
                <div className="card location-card shadow-sm w-100 overflow-hidden">
                  <div className="img-container">
                    <img
                      src={`http://localhost:8000${property.property_image}`}
                      alt={property.title}
                      className="card-img-top location-img"
                    />
                  </div>
                  <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center text-white location-overlay">
                    <h5 className="location-title">{property.title}</h5>
                    <span className="location-subtext">{property.property_type}</span>
                    <span className="location-subtext">${property.rent}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;
