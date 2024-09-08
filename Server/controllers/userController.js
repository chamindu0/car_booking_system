// server/controllers/userController.js
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

exports.registerUser = async (req, res) => {
    const { name, email, phone, role } = req.body;

    try {
        // Check if the user is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already registered with this email.' });
        }

        // Create a new user
        const newUser = new User({ name, email, phone, role });
        await newUser.save();

        // Compose email subject and message based on the user's role
        let subject, message;
        if (role === 'driver') {
            subject = 'Welcome to City Taxi as a Driver!';
            message = `Hello ${name},\n\nThank you for registering as a driver with City Taxi! You will soon receive requests for rides from passengers. Please make sure to log in to your driver portal to manage your availability and rides.\n\nBest regards,\nCity Taxi Team`;
        } else {
            subject = 'Welcome to City Taxi as a Passenger!';
            message = `Hello ${name},\n\nThank you for registering as a passenger with City Taxi! You can now book rides easily through our platform. We hope you enjoy using our services.\n\nBest regards,\nCity Taxi Team`;
        }

        // Send the email
        await sendEmail(email, subject, message);

        // Respond to the client
        res.json({ success: true, message: 'User registered and email sent.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, message: 'Failed to register user.' });
    }
};
