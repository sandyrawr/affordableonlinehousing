import React from 'react';
import { Link } from 'react-router-dom';
import './StartPage.css';

function StartPage() {
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
                <p>Select an option to continue</p>
            </div>

            <div className="button-group">
                <Link to="/startregister">
                <button type="button" className="btn btn-success w-100">
                    Register
                </button>
                </Link>
                <Link to="/login">
                <button type="button" className="btn btn-success w-100">
                    Log in
                </button>
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}

export default StartPage;
