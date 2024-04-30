const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { SESSION_DURATION } = require('./config/config');

const authRoutes = require('./Routes/authRoutes');
const UserController = require('./Controllers/UserController');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Session configuration
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'secret', // Session secret (change in production)
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: SESSION_DURATION || 3600000, // Use SESSION_DURATION from config.js (fallback to 1 hour)
      },
    })
  );

// Register the authentication routes
app.use('/auth', authRoutes);

// Route to get current user (for authenticated routes)
app.get('/api/me', UserController.getCurrentUser);

module.exports = app;
