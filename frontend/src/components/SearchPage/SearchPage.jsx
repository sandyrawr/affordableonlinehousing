// SearchPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, NavLink } from "react-router-dom";
import {
  Building2,
  DollarSign,
  Sun,
  Car,
  TreePine,
  Waves,
  ArrowUpDown,
  PawPrint,
  User,
  Home,
  Search,
  CalendarDays,
  MapPin,
  BedSingle,
  Users,
  
  Bath,
} from "lucide-react";
import Modal from "../Modal/Modal";
import BookingsPopup from "../BookingsPopup/BookingsPopup";
import ToursPopup from "../ToursPopup/ToursPopup";


import "./SearchPage.css";
import Footer from "../Footer/Footer";

const SearchPage = () => {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    property_type: "",
    price_type: "",
    balcony_terrace: false,
    parking_space: false,
    co_living: false,
    swimming_pool: false,
    lift_elevator: false,
    pet_friendly: false,
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locationName = searchParams.get("location");
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

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
    if (locationName) {
      const params = {
        location: locationName,
        ...filters,
      };
      axios
        .get("http://localhost:8000/properties/", { params })
        .then((response) => setProperties(response.data))
        .catch((error) =>
          console.error("Error fetching properties:", error)
        );
    }
  }, [locationName, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="search-container">
      <div className="top-bar">
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
          <button 
            className="nav-link" 
            onClick={() => openModal(<BookingsPopup />)}
          >
            <CalendarDays size={18} className="nav-icon" /> My Bookings
          </button>
          <button 
            className="nav-link" 
            onClick={() => openModal(<ToursPopup />)}
          >
            <MapPin size={18} className="nav-icon" /> My Tours
          </button>
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
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
      <div className="content-wrapper">
        <aside className="filter-sidebar">
          <h4>Filters</h4>

          <div className="form-group">
            <label>
              <Building2 size={16} className="filter-icon" /> Property Type
            </label>
            <select name="property_type" value={filters.property_type} onChange={handleFilterChange}>
              <option value="">Select</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
              {/* <option value="Commercial">Commercial</option> */}
              {/* <option value="Flat">Flat</option> */}
            </select>
          </div>

          <div className="form-group">
            <label>
              <DollarSign size={16} className="filter-icon" /> Price Type
            </label>
            <select name="price_type" value={filters.price_type} onChange={handleFilterChange}>
              <option value="">Select</option>
              <option value="Fixed">Fixed</option>
              <option value="Negotiable">Negotiable</option>
            </select>
          </div>

          {[
            { label: "Balcony/Terrace", name: "balcony_terrace", icon: <Sun size={16} /> },
            { label: "Parking Space", name: "parking_space", icon: <Car size={16} /> },
            { label: "Co-living", name: "co_living", icon: <Users size={16} /> },
            { label: "Swimming Pool", name: "swimming_pool", icon: <Waves size={16} /> },
            { label: "Lift/Elevator", name: "lift_elevator", icon: <ArrowUpDown size={16} /> },
            { label: "Pet Friendly", name: "pet_friendly", icon: <PawPrint size={16} /> }
          ].map((item) => (
            <div key={item.name} className="checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={filters[item.name]}
                  onChange={handleFilterChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                {item.icon}
                <span className="checkbox-text">{item.label}</span>
              </label>
            </div>
          ))}
        </aside>

        <main className="main-content">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search by title..."
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
            />
          </div>

          <div className="property-type-nav">
          {[
            { value: "Apartment", label: "Apartments" },
            { value: "House", label: "Houses" },
            { value: "", label: "All Properties" },
            { value: "Studio", label: "Studios" },
            { value: "Villa", label: "Villas" },
            // { value: "Commercial", label: "Commercial" },
            // { value: "Flat", label: "Flats" }
          ].map((type) => (
            <button
              key={type.value}
              className={`property-type-link ${filters.property_type === type.value ? 'active' : ''}`}
              onClick={() => setFilters({...filters, property_type: type.value})}
            >
              {type.label}
            </button>
          ))}
        </div>

          <h2>Search Properties in {locationName}</h2>
          <p className="dream-text">Find your dream home or office here in {locationName}.</p>

          {properties.length === 0 ? (
              <p className="no-properties">No properties found in {locationName}.</p>
            ) : (
              <div className="property-grid">
                {properties.map((property) => (
                  <Link key={property.id} to={`/propertydetails/${property.id}`} className="property-card">
                    {/* Image container with padding */}
                    <div className="property-image-container">
                      <img 
                        src={`http://localhost:8000${property.property_image}`} 
                        alt={property.title} 
                        className="property-image"
                      />
                    </div>
                    
                    {/* Property details */}
                    <div className="property-details">
                      <h3 className="property-title">{property.title}</h3>
                      
                      {/* Amenities container */}
                      <div className="amenities-container">
                        <div className="amenity-item">
                          <BedSingle size={16} className="amenity-icon" />
                          <span>{property.bedrooms} Bedroom</span>
                        </div>
                        <div className="amenity-item">
                          <Users size={16} className="amenity-icon" />
                          <span>{property.max_occupants} Max Occupant</span>
                        </div>
                        <div className="amenity-item">
                          <Bath size={16} className="amenity-icon" />
                          <span>{property.bathrooms} bathroom</span>
                        </div>
                      </div>
                      
                      <p className="property-type">{property.property_type}</p>
                      <p className="property-price">${property.rent}/month</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
