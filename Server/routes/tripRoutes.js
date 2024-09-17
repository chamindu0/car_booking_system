const express = require('express');
const router = express.Router();
const {getTripHistory,payForTrip,rateTrip} = require('../controllers/tripController');

// Route to get trip history for a specific passenger
router.get('/history/:passengerId', getTripHistory);

// Route to handle trip payment
router.post('/pay/:tripId', payForTrip);

// Route to handle trip rating
router.post('/rate/:tripId', rateTrip);

module.exports = router;
