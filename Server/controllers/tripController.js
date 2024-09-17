const Booking = require('../models/bookingModel'); 

// Fetch trip history for a passenger
exports.getTripHistory = async (req, res) => {
          const {passengerId} = req.params;
          
    try {
        const history = await Booking.find({passenger: passengerId});

        res.json({ 
            success: true , 
            history

        });
    } catch (error) {
        console.error('Error fetching trip history:', error);
        res.status(500).json({ success: false, message: 'Error fetching trip history' });
    }
};

// Handle trip payment
exports.payForTrip = async (req, res) => {
    const { tripId } = req.params;
    
    try {
        const booking = await Booking.findById(tripId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ success: false, message: 'Trip already paid' });
        }

        // Assuming payment is processed successfully (this is just a placeholder)
        booking.paymentStatus = 'paid';
        await booking.save();

        res.json({ success: true, message: 'Payment successful' });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Handle trip rating
exports.rateTrip = async (req, res) => {
    const { tripId } = req.params;
    const { rating } = req.body;

    try {
        const booking = await Booking.findById(tripId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.rating !== null) {
            return res.status(400).json({ success: false, message: 'Trip already rated' });
        }

        booking.rating = rating;
        await booking.save();

        res.json({ success: true, message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
