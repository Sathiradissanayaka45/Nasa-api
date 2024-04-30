// NeoWsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MediaDisplay from './MediaDisplay'; // Import MediaDisplay component
import FrameComponent from '../HomepageFrame/FrameComponent';
import './NeoWsPage.css'; // Import custom CSS for NeoWsPage styling

const NeoWsPage = () => {
  const [neoData, setNeoData] = useState([]);

  useEffect(() => {
    const fetchNeoData = async () => {
      try {
        const response = await axios.get(
          'https://api.nasa.gov/neo/rest/v1/feed/today?detailed=false&api_key=tLlGddI02PAYrNiA614r5jaeKnGKvcmWWoPKAw4l'
        );

        if (response.data && response.data.near_earth_objects) {
          // Extract data for today
          const todayData = response.data.near_earth_objects[new Date().toISOString().slice(0, 10)];
          if (todayData) {
            setNeoData(todayData);
          }
        }
      } catch (error) {
        console.error('Error fetching NEO data:', error);
      }
    };

    fetchNeoData();
  }, []);

  return (
    <div className="neo-page">
      <FrameComponent />
      <h1 className="page-title">Near Earth Objects Today</h1>
      <div className="neo-container">
        {neoData.map((neo) => (
          <div key={neo.id} className="neo-card">
            <h3 className="neo-name">{neo.name}</h3>
            <p className="neo-details">
              <strong>Estimated Diameter:</strong> {neo.estimated_diameter.kilometers.estimated_diameter_max} km
            </p>
            <p className="neo-details">
              <strong>Closest Approach Distance:</strong> {neo.close_approach_data[0].miss_distance.kilometers} km
            </p>
            <p className="neo-details">
              <strong>Relative Velocity:</strong> {neo.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h
            </p>
            {neo.media_type && neo.media_url && (
              <MediaDisplay mediaType={neo.media_type} mediaUrl={neo.media_url} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NeoWsPage;
