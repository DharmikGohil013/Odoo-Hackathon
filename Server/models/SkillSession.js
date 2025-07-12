const mongoose = require('mongoose');

const skillSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  skill: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['canvas', 'file', 'video', 'mixed'],
    required: true
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
    role: {
      type: String,
      enum: ['teacher', 'student', 'observer'],
      default: 'student'
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
  canvasSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CanvasSession',
    default: null
  },
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: 20
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  startedAt: {
    type: Date,
    default: null
  },
  endedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
skillSessionSchema.index({ createdBy: 1, createdAt: -1 });
skillSessionSchema.index({ skill: 1, status: 1 });
skillSessionSchema.index({ type: 1, isPublic: 1 });
skillSessionSchema.index({ status: 1, scheduledAt: 1 });

// Virtual for active participants count
skillSessionSchema.virtual('activeParticipantsCount').get(function() {
  return this.participants.filter(p => p.isActive).length;
});

// Ensure virtual fields are serialized
skillSessionSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('SkillSession', skillSessionSchema);
