const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('./mongo');
const patientRoutes = require('./patient/index');

const app = express();
const port = process.env.PORT || 3000;

// Middleware for body parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use patient routes
app.use('/api/patient', patientRoutes);

// Serve static files from public directory
app.use(express.static('public'));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
