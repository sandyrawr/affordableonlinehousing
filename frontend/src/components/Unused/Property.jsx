import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/my-properties/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [token]);

  return (
    <div>
      <h2>My Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>Price: {property.price}</p>
              <p>Location ID: {property.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProperties;
