import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StartPage.module.css'; // CSS Module import

function StartRegister() {
  return (
    <div className={styles["page-wrapper"]}>
      <div className={styles["signup-container"]}>
        <div className={styles["left-box"]}>
          <div className={styles["image-container"]}>
            <img src="locations/house.png" alt="House" className={styles["signup-image"]} />
          </div>
        </div>

        <div className={styles["right-box"]}>
          <div className={styles["form-header"]}>
            <h2>Welcome to Rentable</h2>
            <p>Select your role to continue</p>
          </div>

          <div className={styles["horizontal-button-group"]}>
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
