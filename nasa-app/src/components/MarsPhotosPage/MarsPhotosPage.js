// MarsPhotosPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MarsPhotosPage.css';
import FrameComponent from '../HomepageFrame/FrameComponent';

const MarsPhotosPage = () => {
  const [roverPhotos, setRoverPhotos] = useState([]);

  useEffect(() => {
    const fetchRoverPhotos = async () => {
      try {
        const response = await axios.get(
          'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=tLlGddI02PAYrNiA614r5jaeKnGKvcmWWoPKAw4l'
        );

        if (response.data.photos) {
          setRoverPhotos(response.data.photos);
        }
      } catch (error) {
        console.error('Error fetching Mars rover photos:', error);
      }
    };

    fetchRoverPhotos();
  }, []);

  return (
    <div className="mars-photos-page">
      <FrameComponent />
      <h1 className="page-title">Mars Rover Photos</h1>
      <div className="rover-photos-container">
        {roverPhotos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img
              src={photo.img_src}
              alt={`Mars Rover Photo - ${photo.id}`}
              className="rover-photo"
            />
            <div className="photo-details">
              <p className="photo-title">{photo.camera.full_name}</p>
              <p className="photo-date">Earth Date: {photo.earth_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarsPhotosPage;
