const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // for generating session IDs
const { SESSION_DURATION, JWT_SECRET} = require('../config/config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const UserController = {
    
    register: async (req, res) => {
        try {
          const { username, email, password, selectedOptions } = req.body;
    
          // Check if the email already exists
          const existingEmail = await User.findOne({ email });
          if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
          }
    
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);
    
          // Create a new user
          const newUser = new User({ username, email, password: hashedPassword, selectedOptions });
          await newUser.save();
    
          res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
          console.error('Error during registration:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
    
      login: async (req, res) => {
        try {
          const { email, password } = req.body;
      
          // Find user by email
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
      
          // Compare passwords
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
          }
      
          // Generate JWT token for authentication
          const token = jwt.sign({ userId: user._id, selectedOptions: user.selectedOptions }, JWT_SECRET, { expiresIn: SESSION_DURATION });

          // Fetch user's selected option
          const selectedOptions = user.selectedOptions;
      
          // Respond with success message, user data, and token
          res.status(200).json({
            message: 'User login successful',
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              selectedOptions: user.selectedOptions,
            },
            token,
          });
        } catch (error) {
          console.error('Error during login:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      

  logout: (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.status(200).json({ message: 'User logged out successfully' });
    });
  },

  getCurrentUser: async (req, res) => {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        user: {
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  forgotPassword: async (req, res) => {
    try {
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Save token and expiry time to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sathiradissanayaka80@gmail.com', // Your email
                pass: 'cubn wpts hxzg hqis', // Your password
            },
        });

        const mailOptions = {
          from: 'sathiradissanayaka80@gmail.com',
          to: email,
          subject: 'Password Reset Request',
          html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                      color: #333;
                      margin: 0;
                      padding: 0;
                  }
                  .container {
                      max-width: 600px;
                      margin: 20px auto;
                      padding: 20px;
                      background-color: #fff;
                      border-radius: 10px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #007bff;
                  }
                  p {
                      margin-bottom: 20px;
                  }
                  .button {
                      display: inline-block;
                      background-color: #28a745; /* Green color */
                      color: white;
                      text-decoration: none;
                      padding: 10px 20px;
                      border-radius: 5px;
                      font-weight: bold;
                      cursor: pointer; /* Add cursor pointer */
                  }
                  .button:hover {
                      background-color: #218838; /* Darker green color on hover */
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Password Reset Request</h1>
                  <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                  <p>Please click the button below to reset your password:</p>
                  <a class="button" href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
                  <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
              </div>
          </body>
          </html>
          `,
      };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset instructions sent to your email' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},

resetPassword: async (req, res) => {
  try {
      const { token } = req.params;
      console.log('Reset token:', token);
      const { password } = req.body;

      // Find user by reset token and check if token is still valid
      const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, // Token should not be expired
      });

      console.log('User found:', user); // Log the user object

      if (!user) {
          return res.status(400).json({ error: 'Invalid or expired token' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user's password and reset token fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error('Error during password reset:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
},

};

module.exports = UserController;

