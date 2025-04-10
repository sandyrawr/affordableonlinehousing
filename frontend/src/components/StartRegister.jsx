import React from 'react';
import { Link } from 'react-router-dom';
import './StartPage.css';

function StartRegister() {
  return (
    <div className="page-wrapper">
      <div className="signup-container">
        <div className="left-box">
          <div className="image-container">
            <img src="locations/house.png" alt="House" className="signup-image" />
          </div>
        </div>

        <div className="right-box">
          <div className="form-header">
            <h2>Welcome to Rentable</h2>
            <p>Select your role to continue</p>
          </div>

          <div className="horizontal-button-group">
            <Link to="/registertenant">
              <button type="button" className="btn btn-success">
               Register as Tenant
              </button>
            </Link>
            <Link to="/registerowner">
              <button type="button" className="btn btn-primary">
               Register as Owner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartRegister;
