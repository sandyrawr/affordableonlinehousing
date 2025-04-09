import React, { useEffect, useState } from "react";
import axios from "axios";

const LocationGallery = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/location/") // adjust if needed
      .then(response => setLocations(response.data))
      .catch(error => console.error("Error fetching locations:", error));
  }, []);

  return (
    <div className="container py-5">
      {/* Grid layout for the images with 3 per row on large screens */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {locations.map(location => (
          <div
            key={location.id}
            className="col d-flex align-items-stretch"
          >
            <div className="card shadow-sm w-100">
              <img
                src={`http://localhost:8000${location.image}`}
                alt={location.name}
                className="card-img-top"
                style={{ height: '300px', objectFit: 'cover' }} // Increased height of the image
              />
              <div className="card-img-overlay d-flex justify-content-center align-items-center bg-black opacity-50">
                <h5 className="text-white text-center">{location.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationGallery;
