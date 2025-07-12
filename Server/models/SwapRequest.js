const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  from_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  offered_skill: {
    type: String,
    required: true,
    trim: true,
  },
  requested_skill: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
