import { useEffect, useState } from "react";
import axios from 'axios';
import SideNav from "./SideNav";
import "./Property.css"

function Property() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [livingroom, setLivingroom] = useState("");
  const [washroom, setWashroom] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [status, setStatus] = useState(true);
  const [coliving, setColiving] = useState(false);
  const [parking, setParking] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [petfriendly, setPetfriendly] = useState(false);
  
  const [properties, setProperties] = useState([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    rent: "",
    bedroom: "",
    livingroom: "",
    washroom: "",
    kitchen: ""
  });

  useEffect(() => {
    (async () => await Load())();
  }, []);

  // Validation functions
  const validateTitle = (value) => {
    if (!value.trim()) return "Title is required";
    if (value.length > 255) return "Title too long (max 255 characters)";
    return "";
  };

  const validateDescription = (value) => {
    if (!value.trim()) return "Description is required";
    if (value.length > 1000) return "Description too long (max 1000 characters)";
    return "";
  };

  const validateNumber = (value, fieldName, maxValue = 20) => {
    if (!value) return `${fieldName} is required`;
    if (!/^\d+$/.test(value)) return "Must be a whole number";
    const num = parseInt(value);
    if (num <= 0) return "Must be greater than 0";
    if (num > maxValue) return `Unreasonably high (max ${maxValue})`;
    return "";
  };

  const validateRent = (value) => {
    if (!value) return "Rent is required";
    if (!/^\d+$/.test(value)) return "Must be a whole number";
    const num = parseInt(value);
    if (num <= 0) return "Must be greater than 0";
    if (num > 100000) return "Unreasonably high (max $100,000)";
    return "";
  };

  const validateAll = () => {
    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);
    const rentError = validateRent(rent);
    const bedroomError = validateNumber(bedroom, "Bedroom count");
    const livingroomError = validateNumber(livingroom, "Living room count");
    const washroomError = validateNumber(washroom, "Washroom count");
    const kitchenError = validateNumber(kitchen, "Kitchen count");
    
    setErrors({
      title: titleError,
      description: descriptionError,
      rent: rentError,
      bedroom: bedroomError,
      livingroom: livingroomError,
      washroom: washroomError,
      kitchen: kitchenError
    });

    return !titleError && !descriptionError && !rentError && 
           !bedroomError && !livingroomError && !washroomError && !kitchenError;
  };

  async function Load() {
    try {
      const result = await axios.get("http://127.0.0.1:8000/property/");
      setProperties(result.data);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load property data");
    }
  }

  async function save(event) {
    event.preventDefault();
    if (!validateAll()) return;

    try {
      await axios.post("http://127.0.0.1:8000/property/", {
        title: title,
        description: description,
        rent: parseInt(rent),
        bedroom: parseInt(bedroom),
        livingroom: parseInt(livingroom),
        washroom: parseInt(washroom),
        kitchen: parseInt(kitchen),
        status: status,
        coliving: coliving,
        parking: parking,
        balcony: balcony,
        petfriendly: petfriendly
      });
      alert("Property Added Successfully");
      resetForm();
      Load();
    } catch(err) {
      console.error("Registration error:", err);
      alert("Property Registration Failed");
    }
  }

  async function update(event) {
    event.preventDefault();
    if (!validateAll()) return;

    try {
      await axios.put(`http://127.0.0.1:8000/property/${id}/`, {
        id: id,
        title: title,
        description: description,
        rent: parseInt(rent),
        bedroom: parseInt(bedroom),
        livingroom: parseInt(livingroom),
        washroom: parseInt(washroom),
        kitchen: parseInt(kitchen),
        status: status,
        coliving: coliving,
        parking: parking,
        balcony: balcony,
        petfriendly: petfriendly
      });
      alert("Property Updated Successfully");
      resetForm();
      Load();
    } catch(err) {
      console.error("Update error:", err);
      alert("Property Update Failed");
    }
  }

  function resetForm() {
    setId("");
    setTitle("");
    setDescription("");
    setRent("");
    setBedroom("");
    setLivingroom("");
    setWashroom("");
    setKitchen("");
    setStatus(true);
    setColiving(false);
    setParking(false);
    setBalcony(false);
    setPetfriendly(false);
    setErrors({
      title: "",
      description: "",
      rent: "",
      bedroom: "",
      livingroom: "",
      washroom: "",
      kitchen: ""
    });
  }

  async function editProperty(property) {
    setId(property.id);
    setTitle(property.title);
    setDescription(property.description);
    setRent(property.rent.toString());
    setBedroom(property.bedroom.toString());
    setLivingroom(property.livingroom.toString());
    setWashroom(property.washroom.toString());
    setKitchen(property.kitchen.toString());
    setStatus(property.status);
    setColiving(property.coliving);
    setParking(property.parking);
    setBalcony(property.balcony);
    setPetfriendly(property.petfriendly);
    // setPropertyId(property.propertyid);
    window.scrollTo(0, 0);
  }

  async function DeleteProperty(id) {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/property/${id}/`);
      alert("Property Deleted Successfully");
      resetForm();
      Load();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete property");
    }
  }

  function toggleBooleanState(setter, currentValue) {
    setter(!currentValue);
  }

  return (
    <div className="property-container">
      <SideNav/>
      <property-content>
      <h1 className="text-center my-4">Property Management</h1>
      
      {/* Form Section */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Property Title*</label>
              <input 
                type="text" 
                className={`form-control ${errors.title && "is-invalid"}`} 
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors({...errors, title: validateTitle(e.target.value)});
                }}
                placeholder="Enter property title"
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="form-group mt-3">
              <label>Description*</label>
              <textarea
                className={`form-control ${errors.description && "is-invalid"}`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors({...errors, description: validateDescription(e.target.value)});
                }}
                placeholder="Enter property description"
                rows="3"
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label>Monthly Rent ($)*</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.rent && "is-invalid"}`}
                  value={rent}
                  onChange={(e) => {
                    setRent(e.target.value);
                    setErrors({...errors, rent: validateRent(e.target.value)});
                  }}
                  placeholder="Enter monthly rent"
                />
                {errors.rent && <div className="invalid-feedback">{errors.rent}</div>}
              </div>
              
              <div className="col-md-6">
                <label>Status</label>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={status}
                    onChange={() => toggleBooleanState(setStatus, status)}
                  />
                  <label className="form-check-label">
                    {status ? "Available" : "Not Available"}
                  </label>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-3">
                <label>Bedrooms*</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.bedroom && "is-invalid"}`}
                  value={bedroom}
                  onChange={(e) => {
                    setBedroom(e.target.value);
                    setErrors({...errors, bedroom: validateNumber(e.target.value, "Bedroom count")});
                  }}
                  placeholder="Number of bedrooms"
                />
                {errors.bedroom && <div className="invalid-feedback">{errors.bedroom}</div>}
              </div>
              
              <div className="col-md-3">
                <label>Living Rooms*</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.livingroom && "is-invalid"}`}
                  value={livingroom}
                  onChange={(e) => {
                    setLivingroom(e.target.value);
                    setErrors({...errors, livingroom: validateNumber(e.target.value, "Living room count")});
                  }}
                  placeholder="Number of living rooms"
                />
                {errors.livingroom && <div className="invalid-feedback">{errors.livingroom}</div>}
              </div>
              
              <div className="col-md-3">
                <label>Washrooms*</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.washroom && "is-invalid"}`}
                  value={washroom}
                  onChange={(e) => {
                    setWashroom(e.target.value);
                    setErrors({...errors, washroom: validateNumber(e.target.value, "Washroom count")});
                  }}
                  placeholder="Number of washrooms"
                />
                {errors.washroom && <div className="invalid-feedback">{errors.washroom}</div>}
              </div>
              
              <div className="col-md-3">
                <label>Kitchens*</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.kitchen && "is-invalid"}`}
                  value={kitchen}
                  onChange={(e) => {
                    setKitchen(e.target.value);
                    setErrors({...errors, kitchen: validateNumber(e.target.value, "Kitchen count")});
                  }}
                  placeholder="Number of kitchens"
                />
                {errors.kitchen && <div className="invalid-feedback">{errors.kitchen}</div>}
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={coliving}
                    onChange={() => toggleBooleanState(setColiving, coliving)}
                  />
                  <label className="form-check-label">Co-living Space</label>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={parking}
                    onChange={() => toggleBooleanState(setParking, parking)}
                  />
                  <label className="form-check-label">Parking Available</label>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={balcony}
                    onChange={() => toggleBooleanState(setBalcony, balcony)}
                  />
                  <label className="form-check-label">Balcony</label>
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={petfriendly}
                    onChange={() => toggleBooleanState(setPetfriendly, petfriendly)}
                  />
                  <label className="form-check-label">Pet Friendly</label>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button type="button" className="btn btn-primary me-2" onClick={save}>
                {id ? "Add New" : "Add Property"}
              </button>
              {id && (
                <>
                  <button type="button" className="btn btn-warning me-2" onClick={update}>
                    Update
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
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
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editProperty(property)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => DeleteProperty(property.id)}
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
      </property-content>
      
    </div>
  );
}

export default Property;