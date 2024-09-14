const User = require('../models/userModel');
const Driver = require('../models/driverModel');

exports.registerUserAndDriver = async (req, res) => {
    const { name, email, password, phone, role, vehicleNo, vehicleType } = req.body;

    try {
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
                location: { lat: 0, lng: 0 } // Default location to (0,0)
            });

            await newDriver.save(); // Save the driver document
        }

        // Send response
        res.status(201).json({ success: true,  success: true,
            message: 'Registration successful!',
            role: role // Include the user's role in the response
        });

    } catch (error) {
        console.error('Error registering user and driver:', error);
        res.status(500).json({ success: false, message: 'Failed to register user and driver.' });
    }
};
