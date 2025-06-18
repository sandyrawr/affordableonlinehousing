import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StartPage.module.css';
import { LogIn, UserPlus } from 'lucide-react'; // Lucide icons

function StartPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.signupContainer}>
        {/* Left side with image */}
        <div className={styles.leftBox}>
          <div className={styles.imageContainer}>
            <img
              src="locations/ap2.jpg"
              alt="House"
              className={styles.signupImage}
            />
          </div>
        </div>

        {/* Right side with header and buttons */}
        <div className={styles.rightBox}>
          <div className={styles.formHeader}>
            <h2>
              Welcome to <span className={styles.brand}>Rentable</span>
            </h2>
            <p>Select an option to continue</p>
          </div>

          <div className={styles.buttonGroup}>
            <Link to="/startregister" className={styles.linkButton}>
              <UserPlus size={20} className={styles.icon} />
              Register
            </Link>
            <Link to="/login" className={styles.linkButton}>
              <LogIn size={20} className={styles.icon} />
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
