import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageTenants.module.css';
import { User, Briefcase, ShieldAlert, ShieldCheck, Trash2, X, Eye } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';

const ManageTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tenants/');
                setTenants(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchTenants();
    }, []);

    const openDeleteModal = (tenant) => {
        setSelectedTenant(tenant);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedTenant(null);
    };

    const confirmDeleteTenant = async () => {
        if (!selectedTenant?.id) {
            console.error('No tenant ID available for deletion:', selectedTenant);
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/tenants/${selectedTenant.id}/delete/`);
            setTenants(tenants.filter(t => t.id !== selectedTenant.id));
            setSelectedTenant(null);
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete tenant');
        } finally {
            closeDeleteModal();
        }
    };

    const getEmploymentStatus = (status) => {
        return status ? "Employed" : "Unemployed";
    };

    const getCriminalHistory = (history) => {
        return history ? "Has criminal history" : "No criminal history";
    };

    if (isLoading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tenants</h1>
            
            <div className={styles.tenantGrid}>
                {tenants.map(tenant => (
                    <div key={tenant.id} className={styles.tenantCard}>
                        <div className={styles.cardImageContainer}>
                            {tenant.user_image ? (
                                <img 
                                    src={tenant.user_image} 
                                    alt={tenant.name} 
                                    className={styles.tenantImage}
                                />
                            ) : (
                                <div className={styles.placeholderImage}>
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.tenantName}>{tenant.name}</h3>
                            <div className={styles.cardDetails}>
                                <p>
                                    <Briefcase size={16} /> 
                                    {getEmploymentStatus(tenant.employment_status)}
                                </p>
                                <p>
                                    {tenant.criminal_history ? (
                                        <ShieldAlert size={16} color="red" />
                                    ) : (
                                        <ShieldCheck size={16} color="green" />
                                    )}
                                    {getCriminalHistory(tenant.criminal_history)}
                                </p>
                            </div>
                            <button 
                                className={styles.viewButton}
                                onClick={() => {
                                  setSelectedTenant(tenant);
                                  console.log("Selected Tenant when opening modal:", tenant);  // Add this line
                              }}                            >
                                <Eye size={16} /> View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedTenant && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            {selectedTenant.user_image ? (
                                <img 
                                    src={selectedTenant.user_image} 
                                    alt={selectedTenant.name} 
                                    className={styles.modalImage}
                                />
                            ) : (
                                <div className={styles.modalPlaceholder}>
                                    <User size={64} />
                                </div>
                            )}
                            <h2>{selectedTenant.name}</h2>
                        </div>
                        
                        <div className={styles.modalContent}>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span>{selectedTenant.user.email}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Phone:</span>
                                <span>{selectedTenant.phone_number}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Employment:</span>
                                <span>
                                    <Briefcase size={16} /> 
                                    {getEmploymentStatus(selectedTenant.employment_status)}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Criminal History:</span>
                                <span>
                                    {selectedTenant.criminal_history ? (
                                        <ShieldAlert size={16} color="red" />
                                    ) : (
                                        <ShieldCheck size={16} color="green" />
                                    )}
                                    {getCriminalHistory(selectedTenant.criminal_history)}
                                </span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.detailLabel}>Member Since:</span>
                                <span>{new Date(selectedTenant.tenant_created).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.deleteButton}
                                onClick={() => openDeleteModal(selectedTenant)}
                            >
                                <Trash2 size={18} /> Delete Tenant
                            </button>
                            <button 
                                className={styles.cancelButton}
                                onClick={() => setSelectedTenant(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this tenant?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteTenant}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageTenants;