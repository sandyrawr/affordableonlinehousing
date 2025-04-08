// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './SearchPage.css'

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

// function SearchPage() {
//   const query = useQuery();
//   const navigate = useNavigate();
//   const locationName = query.get('location');
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     bedroom: '',
//     livingroom: '',
//     washroom: '',
//     kitchen: '',
//     minRent: '',
//     maxRent: '',
//     status: true,
//     coliving: false,
//     parking: false,
//     balcony: false,
//     petfriendly: false
//   });

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`/api/properties?location=${locationName}`);
//         setProperties(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     if (locationName) {
//       fetchProperties();
//     }
//   }, [locationName]);

//   const handleFilterChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFilters({
//       ...filters,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const applyFilters = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
      
//       // Add location filter
//       if (locationName) params.append('location', locationName);
      
//       // Add other filters
//       for (const [key, value] of Object.entries(filters)) {
//         if (value !== '' && value !== false) {
//           params.append(key, value);
//         }
//       }
      
//       const response = await axios.get(`/api/properties?${params.toString()}`);
//       setProperties(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const viewPropertyDetails = (propertyId) => {
//     navigate(`/property/${propertyId}`);
//   };

//   if (error) {
//     return <div className="error-message">Error: {error}</div>;
//   }

//   return (
//     <div className="search-page">
//       {/* Sidebar with filters */}
//       <div className="search-sidebar">
//         <img
//           src="/locations/logo.png"
//           alt="Company Logo"
//           className="sidebar-logo"
//         />

//         <h3>Filters</h3>

//         <div className="filter-section">
//           <h4>Rooms</h4>
//           {['bedroom', 'livingroom', 'washroom', 'kitchen'].map((field) => (
//             <div key={field} className="filter-input">
//               <label>
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </label>
//               <input
//                 type="number"
//                 name={field}
//                 min="0"
//                 value={filters[field]}
//                 onChange={handleFilterChange}
//               />
//             </div>
//           ))}
//         </div>

//         <div className="filter-section">
//           <h4>Rent Range</h4>
//           <div className="filter-input">
//             <label>Min Rent</label>
//             <input
//               type="number"
//               name="minRent"
//               min="0"
//               value={filters.minRent}
//               onChange={handleFilterChange}
//             />
//           </div>
//           <div className="filter-input">
//             <label>Max Rent</label>
//             <input
//               type="number"
//               name="maxRent"
//               min="0"
//               value={filters.maxRent}
//               onChange={handleFilterChange}
//             />
//           </div>
//         </div>

//         <div className="filter-section">
//           <h4>Amenities</h4>
//           {[
//             { name: 'coliving', label: 'Coliving' },
//             { name: 'parking', label: 'Parking' },
//             { name: 'balcony', label: 'Balcony' },
//             { name: 'petfriendly', label: 'Pet Friendly' }
//           ].map(({ name, label }) => (
//             <label key={name} className="checkbox-label">
//               <input
//                 type="checkbox"
//                 name={name}
//                 checked={filters[name]}
//                 onChange={handleFilterChange}
//               />
//               {label}
//             </label>
//           ))}
//         </div>

//         <button className="apply-filters" onClick={applyFilters}>
//           Apply Filters
//         </button>
//       </div>

//       {/* Main content area */}
//       <div className="search-main">
//         <div className="search-header">
//           <h2>Properties in {locationName}</h2>
//           <div className="search-controls">
//             <input
//               type="text"
//               placeholder="Search properties..."
//               className="search-input"
//             />
//             <div className="header-buttons">
//               <button>🛒</button>
//               <button>👤</button>
//             </div>
//           </div>
//         </div>

//         <div className="search-results">
//           {loading ? (
//             <div className="loading">Loading properties...</div>
//           ) : properties.length > 0 ? (
//             properties.map((property) => (
//               <div 
//                 key={property.id} 
//                 className="property-card"
//                 onClick={() => viewPropertyDetails(property.id)}
//               >
//                 {/* <div className="property-image">
//                   <img src={property.images?.[0] || '/locations/default.jpg'} alt={property.title} />
//                 </div> */}
//                 <div className="property-details">
//                   <h3>{property.title}</h3>
//                   <p className="property-rent">Rs. {property.rent}/month</p>
//                   <p className="property-location">
//                     <i className="location-icon">📍</i> {property.location.name}
//                   </p>
//                   <div className="property-features">
//                     <span>🛏️ {property.bedroom} Bed</span>
//                     <span>🚿 {property.washroom} Bath</span>
//                     {property.parking && <span>🅿️ Parking</span>}
//                     {property.balcony && <span>🌆 Balcony</span>}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="no-results">
//               No properties found. Try adjusting your filters.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SearchPage;