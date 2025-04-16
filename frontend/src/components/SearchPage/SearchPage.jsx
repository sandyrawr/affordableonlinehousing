import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";  // Hook to read query parameters
import { Link } from "react-router-dom";  // Add this import
import "./SearchPage.module.css";

const SearchPage = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    title: "",  
    property_type: "",
    price_type: "",
    balcony_terrace: false,
    parking_space: false,
    garden_yard: false,
    swimming_pool: false,
    lift_elevator: false,
    pet_friendly: false,
    gym: false,
  });

  const location = useLocation();  // Get the current location from the URL
  const searchParams = new URLSearchParams(location.search);  // Extract query parameters
  const locationName = searchParams.get("location");  // Get the 'location' param

  useEffect(() => {
    if (locationName) {
      const params = {
        location: locationName,
        ...filters,
      };
      axios.get(`http://localhost:8000/properties/`, { params })
        .then(response => setProperties(response.data))
        .catch(error => console.error("Error fetching properties:", error));
    }
  }, [locationName, filters]);  // Re-run effect if location or filters change

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="container py-5">
      <div className="d-flex">
        {/* Sidebar Filter */}
        <div className="sidebar col-md-3 p-3">
          <h4>Filters</h4>
          <div className="form-group">
            <label>Property Type</label>
            <select
              name="property_type"
              value={filters.property_type}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
              <option value="Flat">Flat</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price Type</label>
            <select
              name="price_type"
              value={filters.price_type}
              onChange={handleFilterChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Fixed">Fixed</option>
              <option value="Negotiable">Negotiable</option>
            </select>
          </div>

          {/* Checkbox Filters */}
          <div className="form-group">
            <label>Balcony/Terrace</label>
            <input
              type="checkbox"
              name="balcony_terrace"
              checked={filters.balcony_terrace}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Parking Space</label>
            <input
              type="checkbox"
              name="parking_space"
              checked={filters.parking_space}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Garden/Yard</label>
            <input
              type="checkbox"
              name="garden_yard"
              checked={filters.garden_yard}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Swimming Pool</label>
            <input
              type="checkbox"
              name="swimming_pool"
              checked={filters.swimming_pool}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Lift/Elevator</label>
            <input
              type="checkbox"
              name="lift_elevator"
              checked={filters.lift_elevator}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Pet Friendly</label>
            <input
              type="checkbox"
              name="pet_friendly"
              checked={filters.pet_friendly}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Gym</label>
            <input
              type="checkbox"
              name="gym"
              checked={filters.gym}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        {/* Property Gallery Grid */}
        <div className="main-content col-md-9">
          <div className="top-section d-flex justify-content-between">
            <img src="./locations/logo.png" alt="Logo" className="logo" />
            <Link to="/tenantprofile" className="btn btn-outline-primary profile-btn">Profile</Link> 
          </div>

          <div className="text-center mb-4">
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title..."
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
              />
            </div>
            <h2 className="top-title">Search Properties in {locationName}</h2>
            <p className="top-subtext">Find your dream home or office here in {locationName}.</p>

            {properties.length === 0 && (
              <p className="no-properties-found">No properties found in {locationName}.</p>
            )}
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {properties.map(property => (
              <div key={property.id} className="col d-flex align-items-stretch">
                <Link
                  to={`/propertydetails/${property.id}`}
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
      </div>
    </div>
  );
};

export default SearchPage;
