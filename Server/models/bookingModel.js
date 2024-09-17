const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropoffLocation: {
    type: String,
    required: true,
  },
  date: {
  type:Date,
  default: Date.now
  },
 fare: {
  type: Number,
  min: 0,
 },
  status: {
    type: String,
    enum: ["active", "accepted", "completed", "canceled"],
    default: "active",
  },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  rating: { type: Number, min: 1, max: 5, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
