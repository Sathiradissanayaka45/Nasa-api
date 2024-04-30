const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  selectedOptions: {
    type: [String], // Change to array of strings
    enum: ['APOD', 'MarsRover', 'NEO'], // Assuming these are the options
    required: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
