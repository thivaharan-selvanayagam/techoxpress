const mongoose = require('mongoose');

const RiderSchema = new mongoose.Schema({
  riderId: { type: String, required: true, unique: true }, // e.g., 'RIDER-001'
  name: { type: String, required: true },
  phone: { type: String, required: true },
  vehicle: { type: String, required: true },
  status: { type: String, default: 'Available', enum: ['Available', 'In Transit', 'Offline'] },
  pendingBalance: { type: Number, default: 0 } // 👈 Accumulates un-collected company cash balances
}, { timestamps: true });

module.exports = mongoose.model('Rider', RiderSchema);