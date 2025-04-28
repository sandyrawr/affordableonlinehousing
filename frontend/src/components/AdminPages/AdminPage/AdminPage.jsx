import React, { useState, useEffect } from 'react';
import { MapPin, Home, User, Users, LayoutDashboardIcon, LocateIcon, LogOut } from 'lucide-react';
import styles from './AdminPage.module.css';
import LocationForm from '../LocationForm/LocationForm';
import Dashboard from '../Dashboard/Dashboard';
import ManageProperties from '../ManageProperties/ManageProperties';
import ManageOwners from '../ManageOwners/ManageOwners';
import ManageTenants from '../ManageTenants/ManageTenants';
import EditLocation from '../EditLocation/EditLocation';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'addLocation':
        return <LocationForm />;
      case 'editLocation':
        return <EditLocation />;
      case 'manageProperties':
        return <ManageProperties />;
      case 'manageOwners':
        return <ManageOwners />;
      case 'manageTenants':
        return <ManageTenants />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

    useEffect(() => {
      if (activeTab === 'logout') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }, [activeTab]);

  return (
    <div className={styles.adminContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h1>RENTABLE</h1>
          </div>
          <div className={styles.navButtons}>
            <button
              className={`${styles.navButton} ${activeTab === 'dashboard' ? styles.active : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboardIcon className={styles.icon} size={18} /> Dashboard 
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'addLocation' ? styles.active : ''}`}
              onClick={() => setActiveTab('addLocation')}
            >
              <MapPin className={styles.icon} size={18} /> Add Location
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'editLocation' ? styles.active : ''}`}
              onClick={() => setActiveTab('editLocation')}
            >
              <LocateIcon className={styles.icon} size={18} /> Edit Location
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'manageProperties' ? styles.active : ''}`}
              onClick={() => setActiveTab('manageProperties')}
            >
              <Home className={styles.icon} size={18} /> Manage Properties
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'manageOwners' ? styles.active : ''}`}
              onClick={() => setActiveTab('manageOwners')}
            >
              <User className={styles.icon} size={18} /> Manage Owners
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'manageTenants' ? styles.active : ''}`}
              onClick={() => setActiveTab('manageTenants')}
            >
              <Users className={styles.icon} size={18} /> Manage Tenants
            </button>
            <button
              className={`${styles.navButton} ${activeTab === 'logout' ? styles.active : ''}`}
              onClick={() => setActiveTab('logout')}
            >
              <LogOut className={styles.icon} size={18} /> Log Out
            </button>
          </div>
        </div>
      </div>
      <div className={styles.mainContent}>
          {renderContent()}
        </div>
    </div>
  );
};

export default AdminPage;