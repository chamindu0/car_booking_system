const express = require('express');
const {getDriverDetails,toggleAvailability,getAvailableHires,acceptHire} = require('../controllers/driverController');
const router = express.Router();

// Fetch driver details
router.get('/driver/details', getDriverDetails);

// Toggle availability
router.post('/driver/availability',toggleAvailability);

// Fetch available hires
router.get('/driver/hires/:driverId',getAvailableHires);

// Accept a hire
router.post('/driver/hires/accept',acceptHire);


module.exports = router;
