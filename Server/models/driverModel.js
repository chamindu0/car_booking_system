const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNo: { type: String, required: true },
  vehicleType: { type: String, enum: ['car', 'van', 'three-wheeler'], required: true },
  availability: { type: String, enum: ['available', 'busy'] },
 location: {
    type: {
      type: String,
      enum: ['Point'],  // GeoJSON type must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],  // Array of numbers: [longitude, latitude]
      required: true
    }
  }
},{ timestamps: true });

driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
