import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]); // Change to array for multiple options
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (showLoginForm) {
        const response = await axios.post('http://localhost:8000/auth/login', {
          email,
          password,
        });

        const { user, token } = response.data;
        localStorage.setItem('token', token); // Store the token in localStorage
        onLogin(user);
        setError('');
        navigate('/home');
        toast.success('Login successful!');
      } else {
        if (!username) {
          setError('Username is required.');
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError('Invalid email address.');
          return;
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        if (!usernameRegex.test(username)) {
          setError('Username must be 3-16 characters, alphanumeric and underscores only.');
          return;
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
          setError('Password must be at least 8 characters, containing at least one letter, one number, and one special character.');
          return;
        }

        const response = await axios.post('http://localhost:8000/auth/register', {
          username,
          email,
          password,
          selectedOptions, // Pass array of selected options
        });

        alert('Registration successful!');
        setShowLoginForm(true);
        setError('');
      }
    } catch (error) {
      if (showLoginForm) {
        if (error.response && error.response.status === 400) {
          setError('Invalid email or password.');
        } else {
          setError('Invalid email or password.');
        }
      } else {
        setError('An error occurred during registration.');
      }
    }
  };

  const handleOptionChange = (e) => {
    // Convert selected options to array and update state
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
  };

  const toggleForm = () => {
    setShowLoginForm((prev) => !prev);
    setShowForgotPasswordForm(false);
    setError('');
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:8000/auth/forgot-password', { email });
    } catch (error) {
      console.error('Error during forgot password:', error);
    }
  };
  // Inside the component
const handleCheckboxChange = (e) => {
  const option = e.target.value;
  if (selectedOptions.includes(option)) {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  } else {
    setSelectedOptions([...selectedOptions, option]);
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        {showLoginForm ? (
          <>
            <h2>Welcome Back!</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <button type="submit" className="login-button">
                Log In
              </button>
              <span className="link-button" onClick={() => setShowForgotPasswordForm(true)}>
                Forgot Password?
              </span>
            </form>
            <div className="link-container">
              <span className="link-button" onClick={toggleForm}>
                New User? Create Account
              </span>
            </div>
          </>
        ) : (
          <>
            <h2>Create Account</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
  <input
    type="text"
    placeholder="New Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    className="input-field"
    required
  />
  <input
    type="email"
    placeholder="Your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="input-field"
    required
  />
  <input
    type="password"
    placeholder="New Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="input-field"
    required
  />
  <div className="checkbox-container">
    <p className="checkbox-title">Select what you want service from us:</p>
    <div className="checkbox-options">
      <label>
        <input
          type="checkbox"
          value="APOD"
          checked={selectedOptions.includes("APOD")}
          onChange={handleCheckboxChange}
        />
        Astronomy Picture of the Day
      </label>
      <label>
        <input
          type="checkbox"
          value="MarsRover"
          checked={selectedOptions.includes("MarsRover")}
          onChange={handleCheckboxChange}
        />
        Mars Rover Photos
      </label>
      <label>
        <input
          type="checkbox"
          value="NEO"
          checked={selectedOptions.includes("NEO")}
          onChange={handleCheckboxChange}
        />
        Near Earth Objects
      </label>
    </div>
  </div>
  <button type="submit" className="login-button">
    Register
  </button>
</form>
            <div className="link-container">
              <span className="link-button" onClick={() => setShowLoginForm(true)}>
                Back to Login
              </span>
            </div>
          </>
        )}
        {showForgotPasswordForm && (
          <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
              <button type="submit" className="login-button">
                Reset Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
