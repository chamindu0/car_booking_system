const User = require('../models/userModel');
const Driver = require('../models/driverModel')
const Booking = require('../models/bookingModel');
const Trip = require('../models/tripModel');

// Fetch passenger profile by passengerId
exports.getPassengerProfile = async (req, res) => {
    const { passengerId } = req.params; // Extract passengerId from route params

    try {
        const passenger = await User.findById(passengerId);
        if (!passenger) {
            return res.status(404).json({ success: false, message: 'Passenger not found' });
        }
        res.json({ success: true, passenger });
    } catch (error) {
        console.error('Error fetching passenger profile:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// create a new booking
exports.createBooking = async (req, res) => {
    const { passengerId, pickupLocation, dropoffLocation, date } = req.body;

    try {
        // Create a new booking
        const newBooking = new Booking({
            passenger: passengerId,
            pickupLocation,
            dropoffLocation,
            date,
            status: 'active',
        });

        // Save the new booking to the database
        await newBooking.save();

        res.json({ success: true, booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Fetch active bookings for a passenger by passengerId
exports.getPassengerBookings = async (req, res) => {
    const { passengerId } = req.params;

    try {
        const bookings = await Booking.find({ passenger: passengerId, status: 'active' });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Fetch passenger trip history by passengerId
exports.getPassengerTripHistory = async (req, res) => {
    const { passengerId } = req.params;

    try {
        const history = await Trip.find({ passenger: passengerId }).sort({ date: -1 });
        res.json({ success: true, history });
    } catch (error) {
        console.error('Error fetching trip history:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Cancel a booking by bookingId
exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'canceled'; // Update booking status
        await booking.save();

        res.json({ success: true, message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Controller function to get drivers within a radius
exports.getClosestDrivers = async (req, res) => {
    const { lat, lng, radius } = req.query;

    try {
        const drivers = await Driver.find({}); // Consider optimizing this for large datasets

        const filteredDrivers = drivers.map(driver => {
            const distance = calculateDistance(lat, lng, driver.latitude, driver.longitude);
            return { ...driver.toObject(), distance };
        }).filter(driver => driver.distance <= radius);

        filteredDrivers.sort((a, b) => a.distance - b.distance);

        res.json(filteredDrivers);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}