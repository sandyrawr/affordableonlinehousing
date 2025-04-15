import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StartPage.module.css'; // Import CSS Module

function StartPage() {
  return (
    <div className={styles['page-wrapper']}>
      <div className={styles['signup-container']}>
        <div className={styles['left-box']}>
          <div className={styles['image-container']}>
            <img src="locations/house.png" alt="House" className={styles['signup-image']} />
          </div>
        </div>

        <div className={styles['right-box']}>
            <div className={styles['form-header']}>
                <h2>Welcome to Rentable</h2>
                <p>Select an option to continue</p>
            </div>

            <div className={styles['button-group']}>
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
