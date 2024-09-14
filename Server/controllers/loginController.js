const User = require('../models/userModel');
const Driver = require('../models/driverModel');
const bcrypt = require('bcrypt'); 

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        // Compare passwords (hash from database vs entered password)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid password.' });
        }

       
       let driverId;
       let driverName;
       let passengerId;

        // Check the role of the user
        if (user.role === 'driver') {
            // Fetch driver ID using the user ID
            const driver = await Driver.findOne({userId:user._id});
            
            driverId = driver._id; 
            
                
                
            
        } else if (user.role === 'passenger') {
            // Passenger ID is the user ID
            
            passengerId = user._id;
            console.log(user._id);
        }
         
    
        // Respond with success if login is valid
        res.json({
            success: true,
            message: 'Login successful',
            role: user.role,
            driverId: driverId,
            passengerId: passengerId
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
