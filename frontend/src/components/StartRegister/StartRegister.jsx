import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StartPage.module.css';
import { Home, UserPlus, Building2 } from 'lucide-react'; // Lucide icons

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
            <h2>
              <Home size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Welcome to <span className={styles.brand}>Rentable</span>
            </h2>
            <p>Select your role to continue</p>
          </div>

          <div className={styles["horizontal-button-group"]}>
            <Link to="/registertenant">
              <button type="button" className={`${styles.button} btn btn-success`}>
                <UserPlus size={18} style={{ marginRight: '8px' }} />
                Tenant
              </button>
            </Link>
            <Link to="/registerowner">
              <button type="button" className={`${styles.button} btn btn-primary`}>
                <Building2 size={18} style={{ marginRight: '8px' }} />
                Owner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartRegister;
