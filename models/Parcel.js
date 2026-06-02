const mongoose = require('mongoose');

// Embedded sub-schema for tracking history checkpoints
const EventSchema = new mongoose.Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  label: { type: String, required: true },
  desc: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const ParcelSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true }, // e.g., 'TXT-2025-001'
  status: { type: String, default: 'transit', enum: ['transit', 'delivered'] },
  statusLabel: { type: String, default: 'Manifested' },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  weight: { type: String, required: true },
  service: { type: String, required: true },
  codPrice: { type: Number, default: 0 },
  commission: { type: Number, default: 0 }, // 👈 Stores City-Specific Freelance Commission Payout
  eta: { type: String, default: 'Pending Assignment' },
  assignedRider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null }, // Link to freelancer
  events: [EventSchema] // Dynamic array of chronological history logs
}, { timestamps: true });

module.exports = mongoose.model('Parcel', ParcelSchema);