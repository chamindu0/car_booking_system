const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleNo: { type: String, required: true },
  vehicleType: { type: String, enum: ['car', 'van', 'three-wheeler'], required: true },
  availability: { type: String, enum: ['available', 'busy'], default: 'busy' },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  }
},{ timestamps: true });

driverSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Driver', driverSchema);
