import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import "./Home.css";

const Home = () => {
  const [locations, setLocations] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/locations/")
      .then(response => setLocations(response.data))
      .catch(error => console.error("Error fetching locations:", error));
  }, []);

  // Sample slider images — replace with real ones or fetch dynamically
  const sliderImages = [
    "/locations/landingquality.jpg",
    "/locations/ap11.jpg",
    "/locations/landing.jpg",
    "/locations/landingquality.jpg",
    "/locations/ap9.jpg"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovering) {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isHovering, sliderImages.length]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.clear();
    
    // Redirect to login page
    window.location.href = '/login';
    
    // Close dropdown (optional)
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // const handlesignout = () => {
  //   // Add your logout logic here
  //   setShowDropdown(false);
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container py-4">
      <div className="fullcontainer">
        {/* Color-changing gradient container */}
      <div className="gradient-container">
        {/* Top Section: Logo and Profile */}
        <div className="top-section">
          <h1 className="logo-text" style={{ fontFamily: "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif" }}>RENTABLE</h1>
          
          {/* Hamburger Menu Button with Lucide icon */}
          <div className="dropdown-container">
            <button 
              className="hamburger-btn" 
              onClick={toggleDropdown}
              aria-label="Menu"
            >
              <Menu size={24} />
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
        

        <div className="slogan-slider-container">
            {/* Slogan text on the left */}
            <div className="housing-slogan">
              <h2 className="slogan-text">Turning the Dream of a Home Into an Affordable Reality</h2>
            </div>  

        {/* Image Slider */}
        <div 
          className="slider-container mb-5"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div 
            className="slider-wrapper"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {sliderImages.map((src, index) => (
              <img 
                key={index} 
                src={src} 
                alt={`Slide ${index + 1}`} 
                className="slider-image"
              />
            ))}
          </div>
          
          {/* Image indicator bar */}
          <div className="slider-indicators">
            {sliderImages.map((_, index) => (
              <div
                key={index}
                className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
      </div>

      </div>
      
  
      {/* Rest of your content remains exactly the same */}
      <div className="text-center mb-4">
        <h2 className="top-title">Rent Anywhere</h2>
        <p className="top-subtext">Find the perfect place to live, no matter where you are.</p>
      </div>

      {/* Location Gallery */}
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