import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css'; // Import the same CSS file used for LoginForm
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordForm = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false); // State to track success

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Regular expressions for password validation
        const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
        const hasNumber = /\d/;
        const hasLetter = /[a-zA-Z]/;
    
        // Check if the password meets all the requirements
        if (password.length < 8 || !hasSymbol.test(password) || !hasNumber.test(password) || !hasLetter.test(password)) {
            let errorMessage = 'Password must have at least 8 characters, one symbol, one number, and one letter.';
            if (!hasSymbol.test(password)) {
                errorMessage += ' Need at least one symbol.';
            }
            if (!hasNumber.test(password)) {
                errorMessage += ' Need at least one number.';
            }
            if (!hasLetter.test(password)) {
                errorMessage += ' Need at least one letter.';
            }
            setMessage(errorMessage);
            return;
        }
    
        // Check if the password and confirm password match
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
    
        try {
            const response = await axios.post(`http://localhost:8000/auth/reset-password/${token}`, {
                password,
            });
            setMessage(response.data.message);
            setSuccess(true); // Set success to true after successful password reset
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    const handleClose = () => {
        if (window.confirm('Do you want to close this tab?')) {
            window.close();
        }
    };

    return (
        <div className="login-container">
            {!success && (
                <div className="login-card">
                    <h2>Change Password</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-field"
                        />
                        <button type="submit" className="login-button"> 
                            Change Password
                        </button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            )}
            <ToastContainer />
            {success && (
                <div>
                    <ToastContainer />
                    <div style={{ background: 'rgba(0, 0, 0, 0.6)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#fff' }}>
                        <p>Password changed successfully!</p>
                        <p style={{ color: 'red', textDecoration: 'underline' }}>You can change password only one time here</p>
                    </div>
                </div>
            )}
            {success && setTimeout(handleClose, 3000)}
        </div>
    );
};

export default ChangePasswordForm;
