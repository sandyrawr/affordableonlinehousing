import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProperty() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate();

  // Load all properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/property/');
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('Failed to load properties');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/property/${id}/`);
      alert('Property deleted successfully');
      fetchProperties(); // Refresh the list
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property');
    }
  };

  const handleSelect = (property) => {
    setSelectedProperty(property);
    // Navigate to edit form with property data
    navigate('/edit-property-form', { state: { property } });
  };

  return (
    <div className="container-fluid">
      <h1 className="text-center my-4">Edit Properties</h1>
      
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Select</th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Rent</th>
                  <th>Rooms</th>
                  <th>Features</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSelect(property)}
                      >
                        Select
                      </button>
                    </td>
                    <td>{property.id}</td>
                    <td>{property.title}</td>
                    <td>${property.rent}</td>
                    <td>
                      {property.bedroom} Beds, {property.livingroom} Living,<br/>
                      {property.washroom} Baths, {property.kitchen} Kitchens
                    </td>
                    <td>
                      {property.coliving && <span className="badge bg-info me-1">Co-living</span>}
                      {property.parking && <span className="badge bg-info me-1">Parking</span>}
                      {property.balcony && <span className="badge bg-info me-1">Balcony</span>}
                      {property.petfriendly && <span className="badge bg-info me-1">Pet Friendly</span>}
                    </td>
                    <td>
                      {property.status ? (
                        <span className="badge bg-success">Available</span>
                      ) : (
                        <span className="badge bg-danger">Not Available</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(property.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProperty;