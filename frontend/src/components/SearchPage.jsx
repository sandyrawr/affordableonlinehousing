import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchPage.css';

function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    minRent: '',
    maxRent: '',
    bedrooms: '',
    coliving: false,
    parking: false,
    petfriendly: false
  });
  const [searchQuery, setSearchQuery] = useState('');
  const locationState = useLocation().state;
  const currentLocation = locationState?.location || '';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/api/properties?location=${currentLocation}`);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    if (currentLocation) {
      fetchProperties();
    }
  }, [currentLocation]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const filteredProperties = properties.filter(property => {
    return (
      (!filters.minRent || property.rent >= filters.minRent) &&
      (!filters.maxRent || property.rent <= filters.maxRent) &&
      (!filters.bedrooms || property.bedroom == filters.bedrooms) &&
      (!filters.coliving || property.coliving) &&
      (!filters.parking || property.parking) &&
      (!filters.petfriendly || property.petfriendly) &&
      (!searchQuery || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="search-page">
      {/* Navigation Bar */}
      <nav className="search-nav">
        <div className="nav-logo">
          <span className="logo-emoji">🏠</span>
          <span>RENT ANYWHERE</span>
        </div>
        
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="nav-icons">
          <button className="nav-icon">🛒</button>
          <button className="nav-icon">👤</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="search-content">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <h2>Filters</h2>
          
          <div className="filter-group">
            <h3>💰 Price Range</h3>
            <input
              type="number"
              name="minRent"
              placeholder="Min"
              value={filters.minRent}
              onChange={handleFilterChange}
            />
            <input
              type="number"
              name="maxRent"
              placeholder="Max"
              value={filters.maxRent}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <h3>🛏️ Bedrooms</h3>
            <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>🏆 Amenities</h3>
            <label>
              <input
                type="checkbox"
                name="coliving"
                checked={filters.coliving}
                onChange={handleFilterChange}
              />
              🏘️ Coliving
            </label>
            <label>
              <input
                type="checkbox"
                name="parking"
                checked={filters.parking}
                onChange={handleFilterChange}
              />
              🅿️ Parking
            </label>
            <label>
              <input
                type="checkbox"
                name="petfriendly"
                checked={filters.petfriendly}
                onChange={handleFilterChange}
              />
              🐾 Pet Friendly
            </label>
          </div>
        </div>

        {/* Properties List */}
        <div className="properties-list">
          <h2>🏙️ Properties in {currentLocation}</h2>
          {filteredProperties.length > 0 ? (
            <div className="property-grid">
              {filteredProperties.map(property => (
                <div key={property.id} className="property-card">
                  <img src={property.images?.[0] || '/placeholder.jpg'} alt={property.title} />
                  <div className="property-info">
                    <h3>{property.title}</h3>
                    <p className="price">💰 ${property.rent}/mo</p>
                    <p className="details">
                      🛏️ {property.bedroom} bed · 🚿 {property.bathroom} bath
                    </p>
                    <p className="description">{property.description.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>😞 No properties found in {currentLocation}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;