import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from './APODModal';
import FrameComponent from '../HomepageFrame/FrameComponent';
import './APODSelectDatePage.css';

const APODSelectDatePage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [apodData, setApodData] = useState([]);
  const [selectedApod, setSelectedApod] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchData(); // Fetch data on component mount
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.nasa.gov/planetary/apod', {
        params: {
          api_key: 'tLlGddI02PAYrNiA614r5jaeKnGKvcmWWoPKAw4l',
          start_date: startDate,
          end_date: endDate
        }
      });

      if (Array.isArray(response.data)) {
        setApodData(response.data);
      } else {
        console.error('Invalid data format from API');
      }
    } catch (error) {
      console.error('Error fetching APOD:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchData(); // Fetch data when form is submitted

    // Optional: Scroll to the top of the page after form submission
    window.scrollTo(0, 0);
  };

  const openModal = (apod) => {
    setSelectedApod(apod);
  };

  const closeModal = () => {
    setSelectedApod(null);
  };

  const renderMedia = (apod) => {
    if (apod.media_type === 'image') {
      return <img src={apod.url} alt={apod.title} className="apod-image" />;
    } else if (apod.media_type === 'video') {
      return (
        <iframe
          src={apod.url}
          title={apod.title}
          className="apod-video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
    return null;
  };

  return (
    <div className="apod-page">
      <FrameComponent />
      <div className="apod-content">
        <h1 className="apod-title">Select Dates for Astronomy Pictures of the Days</h1>
        <form className="date-form" onSubmit={handleSubmit} ref={formRef}>
          <label className="date-label">
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
          </label>
          <label className="date-label">
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </label>
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        <div className="apod-container">
          {apodData.map((apod, index) => (
            <div key={index} className="apod-card" onClick={() => openModal(apod)}>
              {renderMedia(apod)}
              <div className="apod-details">
                <h3 className="apod-card-title">{apod.title}</h3>
                <p className="apod-card-date">{apod.date}</p>
              </div>
            </div>
          ))}
        </div>

        <Modal isOpen={selectedApod !== null} handleClose={closeModal} apod={selectedApod} />
      </div>
    </div>
  );
};

export default APODSelectDatePage;
