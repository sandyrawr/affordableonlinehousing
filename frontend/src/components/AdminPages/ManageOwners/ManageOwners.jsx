import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ManageOwners.module.css'; // Make sure to create this CSS module
import { User, Briefcase, Trash2, X, Eye, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';

const ManageOwners = () => {
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axios.get('http://localhost:8000/owners/');
                setOwners(response.data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchOwners();
    }, []);

    const openDeleteModal = (owner) => {
        setSelectedOwner(owner);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedOwner(null);
    };

    const confirmDeleteOwner = async () => {
        if (!selectedOwner?.id) {
            console.error('No owner ID available for deletion:', selectedOwner);
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/owners/${selectedOwner.id}/delete/`);
            setOwners(owners.filter(o => o.id !== selectedOwner.id));
            setSelectedOwner(null);
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete owner');
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
            <h1 className={styles.title}>Property Owners</h1>
            
            <div className={styles.ownerGrid}>
                {owners.map(owner => (
                    <div key={owner.id} className={styles.ownerCard}>
                        <div className={styles.cardImageContainer}>
                            {owner.user_image ? (
                                <img 
                                    src={owner.user_image} 
                                    alt={owner.name} 
                                    className={styles.ownerImage}
                                />
                            ) : (
                                <div className={styles.placeholderImage}>
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.ownerName}>{owner.name}</h3>
                            <div className={styles.cardDetails}>
                                <p>
                                    <Briefcase size={16} /> 
                                    {owner.company || 'Independent'}
                                </p>
                                <p>
                                    {owner.criminal_history ? (
                                        <ShieldAlert size={16} color="red" />
                                    ) : (
                                        <ShieldCheck size={16} color="green" />
                                    )}
                                    {getCriminalHistory(owner.criminal_history)}
                                </p>
                            </div>
                            <button 
                                className={styles.viewButton}
                                onClick={() => {
                                    setSelectedOwner(owner);
                                    console.log("Selected Owner:", owner);
                                }}
                            >
                                <Eye size={16} /> View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedOwner && (
                            <div className={styles.modalOverlay}>
                                <div className={styles.modal}>
                                    <div className={styles.modalHeader}>
                                        {selectedOwner.user_image ? (
                                            <img 
                                                src={selectedOwner.user_image} 
                                                alt={selectedOwner.name} 
                                                className={styles.modalImage}
                                            />
                                        ) : (
                                            <div className={styles.modalPlaceholder}>
                                                <User size={64} />
                                            </div>
                                        )}
                                        <h2>{selectedOwner.name}</h2>
                                    </div>
                                    
                                    <div className={styles.modalContent}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Email:</span>
                                            <span>{selectedOwner.user.email}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Phone:</span>
                                            <span>{selectedOwner.phone_number}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Employment:</span>
                                            <span>
                                                <Briefcase size={16} /> 
                                                {getEmploymentStatus(selectedOwner.employment_status)}
                                            </span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Criminal History:</span>
                                            <span>
                                                {selectedOwner.criminal_history ? (
                                                    <ShieldAlert size={16} color="red" />
                                                ) : (
                                                    <ShieldCheck size={16} color="green" />
                                                )}
                                                {getCriminalHistory(selectedOwner.criminal_history)}
                                            </span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Member Since:</span>
                                            <span>{new Date(selectedOwner.owner_created).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.modalFooter}>
                                        <button 
                                            className={styles.deleteButton}
                                            onClick={() => openDeleteModal(selectedOwner)}
                                        >
                                            <Trash2 size={18} /> Delete Owner
                                        </button>
                                        <button 
                                            className={styles.cancelButton}
                                            onClick={() => setSelectedOwner(null)}
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
                    Are you sure you want to delete this owner?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDeleteModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteOwner}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageOwners;