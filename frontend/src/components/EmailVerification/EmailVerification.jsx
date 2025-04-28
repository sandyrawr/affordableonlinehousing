import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './EmailVerification.module.css';
import { Mail, Lock } from 'lucide-react';

const EmailVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from location state or query params
  const email = location.state?.email || new URLSearchParams(location.search).get('email');

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    try {
      // Send email and OTP to the backend for verification
      await axios.post('http://localhost:8000/verify-email/', {
        email: location.state?.email,
        otp: otp,
      });
  
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error(err);
      setMessage('Verification failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setMessage('Email address is required');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/send-otp/', {
        email: email
      });
      setMessage('New OTP sent successfully! Check your email.');
    } catch (err) {
      console.error(err);
      setMessage('Failed to resend OTP: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.verificationContainer}>
        <div className={styles.verificationBox}>
          <div className={styles.formHeader}>
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit code to {email}</p>
          </div>

          {message && <div className={message.includes('success') ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>}

          <form onSubmit={handleVerify} className={styles.verificationForm}>
            <div className={styles.inputGroup}>
              <Mail className={styles.icon} />
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className={styles.formControl}
                maxLength="6"
              />
            </div>

            <div className={styles.submitGroup}>
              <button 
                type="submit" 
                className={`${styles.btnPrimary} ${styles.formControl}`}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>

            <div className={styles.resendLink}>
              Didn't receive the code?{' '}
              <button 
                type="button" 
                onClick={handleResendOTP}
                className={styles.resendButton}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;