import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/location/")
      .then(response => setLocations(response.data))
      .catch(error => console.error("Error fetching locations:", error));
  }, []);

  return (
    <div className="container py-5">
      {/* Top Section: Logo on the left, Profile button on the right */}
      <div className="top-section">
        {/* Logo */}
        <img src="./locations/logo.png" alt="Logo" className="logo" />
        
        {/* Profile Button */}
        <Link to="/profile" className="btn btn-outline-primary profile-btn">Profile</Link>
      </div>

      {/* Centered Top Text with Subtext */}
      <div className="text-center mb-4">
        <h2 className="top-title">Rent Anywhere</h2>
        <p className="top-subtext">Find the perfect place to live, no matter where you are.</p>
      </div>

      {/* Location Gallery Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {locations.map(location => (
          <div key={location.id} className="col d-flex align-items-stretch">
            <Link
              to={`/search?location=${encodeURIComponent(location.name)}`}
              className="w-100 text-decoration-none"
            >
              <div className="card location-card shadow-sm w-100 overflow-hidden">
                <div className="img-container">
                  <img
                    src={`http://localhost:8000${location.image}`}
                    alt={location.name}
                    className="card-img-top location-img"
                  />
                </div>
                <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center text-white location-overlay">
                  <h5 className="location-title">{location.name}</h5>
                  <span className="location-subtext">See properties for {location.name}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
