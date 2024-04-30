import React from 'react';
import { Link } from 'react-router-dom';
import FrameComponent from '../HomepageFrame/FrameComponent';
import './HomePage.css';

const HomePage = () => {
  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };

  // Call getCurrentDate to get the current date
  const currentDate = getCurrentDate();

  return (
    <div className="desktop-2">
      {/* Video Background */}
      <video className="video-background" autoPlay loop muted>
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Frame Component */}
      <FrameComponent />

      {/* Content Section */}
      <main className="information-panel">
        <div className="description-panel">
          <div className="welcome-panel">
            <h1 className="welcome-to-spacing">Welcome to SPACING OUT</h1>
            <div className="check-out-nasas">
              Check out NASA's picture of the day down below
            </div>
          </div>
          {/* Use currentDate in Link to pass as a query parameter */}
          <Link to={`/apod?date=${currentDate}`} className="image-title-panel">
            <div className="image-title-panel-child"></div>
            <div className="picture-of-the">Picture of the day</div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
