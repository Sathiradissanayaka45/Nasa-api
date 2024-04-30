import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/register', formData);
      console.log(response.data); // Handle success
    } catch (error) {
      console.error(error.response.data); // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleInputChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleInputChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
