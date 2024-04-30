import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherPage = () => {
  const [spaceWeatherData, setSpaceWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpaceWeatherData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'https://kauai.ccmc.gsfc.nasa.gov/DONKI/WS/get/FLR?startDate=2023-01-01&endDate=2023-01-07',
          {
            headers: {
              'Content-Type': 'application/json',
              'Api-Key': 'tLlGddI02PAYrNiA614r5jaeKnGKvcmWWoPKAw4l' // Replace 'YOUR_API_KEY_HERE' with your actual API key
            }
          }
        );
        setSpaceWeatherData(response.data);
      } catch (error) {
        setError('Error fetching space weather data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaceWeatherData();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center mt-4">Space Weather Events</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : spaceWeatherData ? (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ul>
              {spaceWeatherData.map((event, index) => (
                <li key={index}>
                  <strong>Event Type:</strong> {event.eventType} <br />
                  <strong>Start Time:</strong> {event.startTime} <br />
                  <strong>End Time:</strong> {event.endTime} <br />
                  <strong>Active Region Num:</strong> {event.activeRegionNum} <br />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No space weather data available.</p>
      )}
    </div>
  );
};

export default WeatherPage;
