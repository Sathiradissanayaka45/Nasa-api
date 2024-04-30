import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import APODPage from './components/ApodPage/ApodPage';
import MarsPhotosPage from './components/MarsPhotosPage/MarsPhotosPage';
import APODSelectDatePage from './components/APOD Images/APODSelectDatePage';
import NeoWsPage from './components/NeoPage/NeoWsPage';
import LoginForm from './components/login/LoginForm';
import ForgotPasswordForm from './components/login/ForgotPasswordForm';
import ChangePasswordForm from './components/login/ChangePasswordForm';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import EarthPage from './components/EarthPage/EarthPage';
import WeatherPage from './components/WeatherPage/WeatherPage';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (user) => {
    // Your logic to handle login, such as setting loggedIn state to true
    console.log('User logged in:', user);
    setLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password/:token" element={<ChangePasswordForm />} />
        <Route path="/apod" element={loggedIn ? <APODPage /> : <Navigate to="/" />} />
        <Route path="/apod-select-date" element={loggedIn ? <APODSelectDatePage /> : <Navigate to="/" />} />
        <Route path="/mars-photos" element={loggedIn ? <MarsPhotosPage /> : <Navigate to="/" />} />
        <Route path="/home" element={loggedIn ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/neo" element={loggedIn ? <NeoWsPage /> : <Navigate to="/" />} />
        <Route path="/earth" element={<EarthPage />} />
        <Route path="/weather" element={<WeatherPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
