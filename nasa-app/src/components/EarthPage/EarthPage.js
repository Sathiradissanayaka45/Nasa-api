import React, { useState } from 'react';
import axios from 'axios';
import './EarthPage.css';
import FrameComponent from '../HomepageFrame/FrameComponent';

const EarthPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [earthImagery, setEarthImagery] = useState(null);
  const [error, setError] = useState(null);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      const response = await axios.get(
        `https://api.nasa.gov/planetary/earth/imagery?lon=-74.006&lat=40.7128&date=${selectedDate}&dim=0.1&api_key=tLlGddI02PAYrNiA614r5jaeKnGKvcmWWoPKAw4l`,
        { responseType: 'blob' } // Set response type to blob to receive binary data
      );

      const reader = new FileReader();
      reader.onload = () => {
        setEarthImagery(reader.result); // Set the base64 image data
      };
      reader.readAsDataURL(response.data); // Read blob data as base64

    } catch (error) {
      console.error('Error fetching Earth imagery:', error);
      if (error.response && error.response.status === 404) {
        setError('No imagery available for the selected date.');
      } else {
        setError('Error fetching Earth imagery. Please try again later.');
      }
    }
  };

  return (
    <div className="earth-page">
      <FrameComponent />
      <h1 className="page-title">Earth Imagery</h1>
      <form onSubmit={handleSubmit}>
        <label className="date-label">
          Select Date:
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </label>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      {earthImagery && (
        <div className="image-card">
          <img src={earthImagery} alt="Earth Imagery" className="earth-image" />
        </div>
      )}
      {error && (
        <div className="error-message full-page-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default EarthPage;
