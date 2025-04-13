import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyProperties.css"; // Reuse Home.css for consistent styles

const MyProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios.get("http://localhost:8000/my-properties/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => setProperties(res.data))
    .catch(err => console.error("Error fetching properties:", err));
  }, []);

  return (
    <div className="properties-container py-5">
      <div className="text-center mb-4">
        <h2 className="properties-title">My Listed Properties</h2>
        <p className="properties-subtext">Here are the properties you’ve listed for rent.</p>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {properties.map((property) => (
          <div key={property.id} className="col d-flex align-items-stretch">
            <div className="card property-card shadow-sm w-100 overflow-hidden">
              <div className="image-container">
                <img
                  src={`http://localhost:8000${property.property_image}`}
                  alt={property.title}
                  className="card-img-top property-image"
                />
              </div>
              <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center text-white property-overlay">
                <h5 className="property-title">{property.title}</h5>
                <span className="property-subtext">{property.location.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProperties;
