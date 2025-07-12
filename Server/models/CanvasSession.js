const mongoose = require('mongoose');

const canvasSessionSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    default: 'Canvas Session'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  canvasData: {
    type: String, // JSON string of canvas drawing data
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: 10
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  skillSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillSession',
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
canvasSessionSchema.index({ roomId: 1 });
canvasSessionSchema.index({ createdBy: 1, createdAt: -1 });
canvasSessionSchema.index({ isActive: 1, isPublic: 1 });

// Virtual for active participants count
canvasSessionSchema.virtual('activeParticipantsCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Ensure virtual fields are serialized
canvasSessionSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('CanvasSession', canvasSessionSchema);
