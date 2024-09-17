const Driver = require('../models/driverModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');


const mongoose = require('mongoose');

// Fetch driver details
exports.getDriverDetails = async (req, res) => {
    try {
        const driverId = req.query.driverId;

        // Check if driverId is valid
        if (!mongoose.Types.ObjectId.isValid(driverId)) {
            return res.status(400).json({ success: false, message: 'Invalid driver ID' });
        }

        // Find the driver by ID
        const driver = await Driver.findById(driverId);
        
        if (!driver) {
            return res.status(404).json({ success: false, message: 'Driver not found' });
        }

        // Assuming the driver has a reference to the user (if stored separately)
        const user = await User.findById(driver.userId); // Assuming driver has a `userId` field
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Send driver and user details in the response
        res.json({
            vehicleNo: driver.vehicleNo,
            vehicleType: driver.vehicleType,
            availability: driver.availability,
            location: driver.location,
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
    } catch (error) {
        console.error('Error fetching driver details:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Toggle driver availability
exports.toggleAvailability = async (req, res) => {
    try {
        const driver = await Driver.findById(req.body.driverId);
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        if(req.body.availability == true)
        {
            driver.availability = "available";
        }else{
            driver.availability = "busy";
        }
        
        await driver.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Fetch available hires
exports.getAvailableHires = async (req, res) => {
    const {driverId} = req.params;
    console.log(driverId);
    try {
        const hires = await Booking.find({driver: driverId, status: 'active' }).populate('passenger', 'name'); 
        console.log(hires)
        res.json(hires);
    } catch (error) {
        console.error('Error fetching available hires:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Accept a hire
exports.acceptHire = async (req, res) => {
    try {
        const { hireId, driverId } = req.query;

        // Check if both hireId and driverId are provided
        if (!hireId || !driverId) {
            return res.status(400).json({ success: false, message: 'hireId and driverId are required' });
        }

        // Find the hire by ID
        const hire = await Booking.findById(hireId);
        if (!hire) {
            return res.status(404).json({ success: false, message: 'Hire not found' });
        }

        // Ensure the hire is still active before accepting
        if (hire.status !== 'active') {
            return res.status(400).json({ success: false, message: 'Hire is not available for acceptance' });
        }

        // Validate that the driver exists
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: 'Driver not found' });
        }

        // Update the hire status and assign the driver
        hire.status = 'accepted';
        hire.driver = driverId;
        await hire.save();

        res.json({ success: true, message: 'Hire accepted successfully' });
    } catch (error) {
        console.error('Error accepting hire:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


