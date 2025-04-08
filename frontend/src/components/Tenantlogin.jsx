import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Import the Login-specific CSS

const TenantLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/tenant/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                navigate('/sidenav'); // Navigate to SideNav upon successful login
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error(err);
        }
    };

    return (
        <div className="page-wrapper login-page">
            <div className="login-container">
                <div className="left-box">
                    <h2 className="form-header">Tenant Login</h2>
                    {error && <p className="message">{error}</p>}

                    {/* Continue your journey text */}
                    <div className="continue-text">
                        <p>Continue your journey with us!</p>
                    </div>

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder='Email Address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="submit-group">
                            <button type="submit" className="btn-success w-100">Login</button>
                        </div>
                    </form>

                    {/* Link to signup page */}
                    <div className="signup-link">
                        <p>
                            Don't have an account? <a href="/signup">Sign up</a>
                        </p>
                    </div>
                </div>

                <div className="right-box">
                    <div className="image-container">
                        <img src="locations/house.png" alt="House" className="signup-image" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantLogin;
