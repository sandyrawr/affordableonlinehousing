import React from 'react';
import { Link } from 'react-router-dom';
import styles from './StartPage.module.css';
import { Home, UserPlus, Building2 } from 'lucide-react'; // Lucide icons

function StartRegister() {
  return (
    <div className={styles.pageWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#ffffff' }}>
      <h2 style={{ color: '#1a1a2e', fontWeight: 'bold', marginBottom: '10px' }}>Select Your Role</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}>Choose the type of account to proceed</p>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <Link to="/registertenant" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', textAlign: 'center', width: '200px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <UserPlus size={40} style={{ color: '#1a1a2e', marginBottom: '10px' }} />
            <h3 style={{ color: '#1a1a2e', marginBottom: '5px' }}>Tenant</h3>
            <p style={{ color: '#555' }}>Find and rent properties easily</p>
          </div>
        </Link>

        <Link to="/registerowner" style={{ textDecoration: 'none' }}>
          <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '20px', textAlign: 'center', width: '200px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <Building2 size={40} style={{ color: '#1a1a2e', marginBottom: '10px' }} />
            <h3 style={{ color: '#1a1a2e', marginBottom: '5px' }}>Owner</h3>
            <p style={{ color: '#555' }}>List and manage your properties</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default StartRegister;
