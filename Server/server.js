const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const driverRoutes = require('./routes/driverRoutes');
const pessengerRoutes = require('./routes/passengerRoutes')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ;

// Log environment variables
console.log('PORT:', PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);

// Middleware to parse JSON requests
app.use(cors({
  origin: 'http://127.0.0.1:5500'
}));
app.use(express.json());

// Connect to MongoDB

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', driverRoutes);
app.use('/', pessengerRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server startup error:', err);
});