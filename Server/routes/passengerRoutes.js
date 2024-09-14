const express = require('express');
const router = express.Router();
const {getPassengerProfile,getPassengerBookings,getPassengerTripHistory,cancelBooking,createBooking,getClosestDrivers} = require('../controllers/passengerController');

// Route to get passenger profile
router.get('/passenger/profile/:passengerId', getPassengerProfile);

// Route to get passenger's active bookings
router.get('/passenger/bookings/:passengerId', getPassengerBookings);

// Route to get passenger's trip history
router.get('/passenger/history/:passengerId',getPassengerTripHistory);

// Route to cancel booking
router.post('/passenger/bookings/:bookingId/cancel', cancelBooking);

router.post('/passenger/bookings/create', createBooking);

//get closest drivers
router.get('/drivers/closest',getClosestDrivers);


module.exports = router;
