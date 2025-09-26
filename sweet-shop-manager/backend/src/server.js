// backend/src/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Create the Express app
const app = express();

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable the express app to parse JSON formatted request bodies

// A simple test route
app.get('/', (req, res) => {
  res.send('Sweet Shop API is running!');
});

// Define Routes
app.use('/api/sweets', require('./routes/sweetRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;

// --- Refactored Server Startup ---
const startServer = async () => {
  try {
    // Connect to the database first
    await connectDB();

    // Only start listening if the DB connection is successful AND we are not in a test environment
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    // Now we can safely exit the main process if the DB fails to connect during startup.
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app; // Export for testing purposes