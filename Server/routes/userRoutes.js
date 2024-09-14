const express = require('express');
const { registerUserAndDriver } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUserAndDriver);  // Call both functions in sequence

module.exports = router;

