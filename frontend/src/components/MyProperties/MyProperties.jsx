import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./MyProperties.module.css";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [locations, setLocations] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      alert("You're not logged in. Please sign in again.");
      window.location.href = "/login";
      return;
    }

    const fetchProperties = async () => {
      try {
        const [propsRes, locsRes] = await Promise.all([
          axios.get("http://localhost:8000/my-properties/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/locations/"),
        ]);

        setProperties(propsRes.data);
        setLocations(locsRes.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        } else {
          console.error("Failed to fetch data:", err);
        }
      }
    };

    fetchProperties();
  }, [token]);


  const handleOpenModal = (property) => {
    const prepared = {
      ...property,
      location_id: property.location.id,
      property_image: property.property_image,
    };
    setSelectedProperty(prepared);
    setOriginalData(JSON.stringify(prepared));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageClick = () => {
    document.getElementById("propertyImageInput").click();
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedProperty((prev) => ({
        ...prev,
        property_image: e.target.files[0],
        image_updated: true,
      }));
    }
  };

  const handleSave = () => {
    const updatedFields = new FormData();
    const originalDataObj = JSON.parse(originalData);
  
    // 1. Include ALL fields except image (we'll handle separately)
    for (const key in originalDataObj) {
      if (key === 'id' || key === 'property_image') continue;
  
      const currentValue = selectedProperty[key] ?? originalDataObj[key];
  
      if (key === 'location_id') {
        updatedFields.append('location', currentValue);
        continue;
      }
  
      // Handle boolean fields
      if ([
        'balcony_terrace', 'parking_space', 'garden_yard',
        'swimming_pool', 'lift_elevator', 'pet_friendly', 'gym'
      ].includes(key)) {
        updatedFields.append(key, currentValue ? 'true' : 'false');
        continue;
      }
  
      updatedFields.append(key, currentValue);
    }
  
    // 2. Handle image based on update status
    if (selectedProperty.image_updated) {
      // Only include if it's a File object
      if (selectedProperty.property_image instanceof File) {
        updatedFields.append('property_image', selectedProperty.property_image);
      }
    } else {
      // If not updated, include the original image PATH (not file)
      updatedFields.append('keep_original_image', 'true'); // Special flag
    }
  
    // 3. Ensure required fields
    if (!updatedFields.has('owner')) {
      updatedFields.append('owner', originalDataObj.owner);
    }
  
    axios.put(`http://localhost:8000/property/${selectedProperty.id}/`, updatedFields, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(() => {
      setShowModal(false);
      window.location.reload();
    })
    .catch((err) => {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update property. Please check all required fields.");
    });
  };
  

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8000/property/${selectedProperty.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setShowModal(false);
        window.location.reload();
      });
  };

  return (
    <div className="properties-container py-5">
      <div className="text-center mb-4">
        <h2 className="properties-title">My Listed Properties</h2>
        <p className="properties-subtext">Click a property to view or edit details.</p>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {properties.map((property) => (
          <div key={property.id} className="col d-flex align-items-stretch">
            <div
              className="card property-card shadow-sm w-100 overflow-hidden"
              style={{ cursor: "pointer" }}
              onClick={() => handleOpenModal(property)}
            >
              <img
                src={`http://localhost:8000${property.property_image}`}
                alt={property.title}
                className="card-img-top property-image"
              />
              <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center text-white property-overlay">
                <h5 className="property-title">{property.title}</h5>
                <span className="property-subtext">{property.location.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <div className="row">
              <div className="col-md-4 text-center">
                <img
                  src={
                    selectedProperty.property_image instanceof File
                      ? URL.createObjectURL(selectedProperty.property_image)
                      : `http://localhost:8000${selectedProperty.property_image}`
                  }
                  alt="Property"
                  className="img-fluid mb-3 rounded shadow"
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                />
                <Form.Control
                  id="propertyImageInput"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <small className="text-muted">Click image to change</small>
              </div>

              <div className="col-md-8">
                <Form>
                  <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={selectedProperty.title}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={selectedProperty.description}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Location</Form.Label>
                    <Form.Select
                      name="location_id"
                      value={selectedProperty.location_id}
                      onChange={handleChange}
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Property Type</Form.Label>
                    <Form.Select
                      name="property_type"
                      value={selectedProperty.property_type}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Studio</option>
                      <option>Villa</option>
                      <option>Commercial</option>
                      <option>Flat</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Total Rooms</Form.Label>
                    <Form.Control
                      type="number"
                      name="total_rooms"
                      value={selectedProperty.total_rooms}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Floor Level</Form.Label>
                    <Form.Control
                      type="text"
                      name="floor_level"
                      value={selectedProperty.floor_level}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Total Floors</Form.Label>
                    <Form.Control
                      type="number"
                      name="total_floors"
                      value={selectedProperty.total_floors}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Property Size</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="property_size"
                      value={selectedProperty.property_size}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Rent</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="rent"
                      value={selectedProperty.rent}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Price Type</Form.Label>
                    <Form.Select
                      name="price_type"
                      value={selectedProperty.price_type}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option>Fixed</option>
                      <option>Negotiable</option>
                    </Form.Select>
                  </Form.Group>

                  {["balcony_terrace", "parking_space", "garden_yard", "swimming_pool", "lift_elevator", "pet_friendly", "gym"].map((field) => (
                    <Form.Check
                      key={field}
                      type="checkbox"
                      label={field.replace(/_/g, " ")}
                      name={field}
                      checked={!!selectedProperty[field]}
                      onChange={handleChange}
                    />
                  ))}
                </Form>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Property
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyProperties;
