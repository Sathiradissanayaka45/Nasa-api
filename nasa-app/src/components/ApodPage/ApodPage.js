import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './APODPage.module.css'; // Import CSS module for styling
import FrameComponent from '../HomepageFrame/FrameComponent'; // Import FrameComponent

const APODPage = () => {
  const [apodData, setApodData] = useState(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const response = await axios.get(
          'https://api.nasa.gov/planetary/apod?api_key=tLlGddI02PAYrNiA614r5jaeKnGKvcmWWoPKAw4l'
        );

        if (response.data) {
          setApodData(response.data);
        }
      } catch (error) {
        console.error('Error fetching APOD data:', error);
      }
    };

    fetchAPOD();
  }, []);

  return (
    <div className={styles['apod-image-one-page']}>
      <FrameComponent /> {/* Render FrameComponent for consistent header */}
      <div className={styles['apod-container']}>
        <h1 className={styles['apod-title']}>Astronomy Picture of the Day</h1>
        {apodData && (
          <div className={styles['apod-content']}>
            <img src={apodData.url} alt={apodData.title} className={styles['apod-image']} />
            <div className={styles['apod-details']}>
              <h2 className={styles['apod-image-title']}>{apodData.title}</h2>
              <p className={styles['apod-explanation']}>{apodData.explanation}</p>
              <p className={styles['apod-date']}>{apodData.date}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APODPage;
