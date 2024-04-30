import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FrameComponent.css';

const FrameComponent = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    setSelectedOptions(decodedToken ? decodedToken.selectedOptions : []);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleLinks = () => {
    setShowLinks((prevShowLinks) => !prevShowLinks);
  };

  const closeDropdown = () => {
    setShowLinks(false);
  };

  return (
    <header className="frame-container">
      <div className="left-section">
        <Link to="/home" className="logo-link" onClick={closeDropdown}>
          <img src="/rectangle-2@2x.png" alt="Logo" className="logo-image" />
        </Link>
        {isMobile ? (
          <button onClick={toggleLinks} className="mobile-nav-toggle">
            {showLinks ? 'Close' : 'Menu'}
          </button>
        ) : (
          <nav className="navigation-links">
            {selectedOptions.includes('APOD') && (
              <Link to="/apod-select-date" className="navigation-link" onClick={closeDropdown}>
                Astronomy Picture of the Day
              </Link>
            )}
            {selectedOptions.includes('MarsRover') && (
              <Link to="/mars-photos" className="navigation-link" onClick={closeDropdown}>
                Mars Rover Photos
              </Link>
            )}
            {selectedOptions.includes('NEO') && (
              <Link to="/neo" className="navigation-link" onClick={closeDropdown}>
                Near Earth Objects
              </Link>
            )}
          </nav>
        )}
      </div>
      {(isMobile && showLinks) && (
        <div className={`mobile-navigation-links ${showLinks ? 'show-links' : ''}`}>
          {selectedOptions.includes('APOD') && (
            <Link to="/apod-select-date" className="mobile-navigation-link" onClick={closeDropdown}>
              Astronomy Picture of the Day
            </Link>
          )}
          {selectedOptions.includes('MarsRover') && (
            <Link to="/mars-photos" className="mobile-navigation-link" onClick={closeDropdown}>
              Mars Rover Photos
            </Link>
          )}
          {selectedOptions.includes('NEO') && (
            <Link to="/neo" className="mobile-navigation-link" onClick={closeDropdown}>
              Near Earth Objects
            </Link>
          )}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
      {!isMobile && (
        <div className="right-section">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default FrameComponent;
