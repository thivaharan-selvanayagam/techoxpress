const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  rider: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rider', 
    required: true 
  },
  amountReceived: { 
    type: Number, 
    required: true 
  },
  remainingBalance: { 
    type: Number, 
    required: true 
  },
  dateStr: { 
    type: String, 
    required: true 
  },
  timeStr: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Settlement', settlementSchema);