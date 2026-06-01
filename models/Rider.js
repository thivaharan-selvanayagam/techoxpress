const mongoose = require('mongoose');

const RiderSchema = new mongoose.Schema({
  riderId: { type: String, required: true, unique: true }, // e.g., 'RIDER-001'
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vehicle: { type: String, required: true },
  status: { type: String, default: 'Available', enum: ['Available', 'In Transit', 'Offline'] }
}, { timestamps: true });

module.exports = mongoose.model('Rider', RiderSchema);