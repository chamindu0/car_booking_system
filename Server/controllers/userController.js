const User = require('../models/userModel');
const Driver = require('../models/driverModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up Nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.registerUserAndDriver = async (req, res) => {
    const { name, email, password, phone, role, vehicleNo, vehicleType } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists!' });
        }

        // Step 1: Create and save the user
        const newUser = new User({ name, email, password, phone, role });
        const savedUser = await newUser.save();

        // Step 2: If the role is 'driver', create and save the driver details
        if (role === 'driver') {
            const newDriver = new Driver({
                userId: savedUser._id,   // Reference the user ID
                vehicleNo,
                vehicleType,
                availability: 'busy',   // Default availability to 'busy'
                location: {
                    type: 'Point',   // Always "Point" for GeoJSON
                    coordinates: [0, 0]   // Default coordinates (latitude, longitude)
                }
            });

            await newDriver.save(); // Save the driver document
        }

        // Step 3: Send email with username and password
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'WELCOME TO CITY TAXI-Registration Successful',
            text: `Hello ${name},\n\nThank you for registering with our system. Here are your login details:\n\nUsername: ${email}\nPassword: ${password}\n\nPlease log in using these credentials.\n\nBest regards,\nCity Taxi Service`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Send response
        res.status(201).json({
            success: true,
            message: 'Registration successful! Email sent with login credentials.',
            role: role // Include the user's role in the response
        });

    } catch (error) {
        console.error('Error registering user and driver:', error);
        let errorMessage = 'Failed to register user and driver.';

        if (error.code === 11000) {
            errorMessage = 'Duplicate email detected. Please use a different email.';
        } else if (error.responseCode === 535) {
            errorMessage = 'Authentication failed with the email service.';
        }

        res.status(500).json({ success: false, message: errorMessage });
    }
};
