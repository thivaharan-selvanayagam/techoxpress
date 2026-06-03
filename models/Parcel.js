const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  time: { type: String, required: true },
  date: { type: String, required: true },
  label: { type: String, required: true },
  desc: { type: String, required: true },
  done: { type: Boolean, default: false }
});

const ParcelSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  status: { type: String, default: 'transit', enum: ['transit', 'delivered'] },
  statusLabel: { type: String, default: 'Manifested' },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  weight: { type: String, required: true },
  service: { type: String, required: true },
  codPrice: { type: Number, default: 0 },
  commission: { type: Number, default: 0 }, // 👈 CRITICAL: If this is missing, MongoDB drops the value!
  eta: { type: String, default: 'Pending Assignment' },
  assignedRider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null },
  events: [EventSchema]
}, { timestamps: true });

module.exports = mongoose.model('Parcel', ParcelSchema);