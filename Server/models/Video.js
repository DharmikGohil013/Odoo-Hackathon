const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String, // Cloudinary thumbnail URL
    default: null
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillSession',
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  quality: {
    type: String,
    enum: ['auto', '360p', '480p', '720p', '1080p'],
    default: 'auto'
  }
}, {
  timestamps: true
});

// Virtual for URL
videoSchema.virtual('url').get(function() {
  return this.cloudinaryUrl;
});

// Ensure virtual fields are serialized
videoSchema.set('toJSON', {
  virtuals: true
});

// Index for search
videoSchema.index({ title: 'text' });
videoSchema.index({ uploadedBy: 1, createdAt: -1 });
videoSchema.index({ isPublic: 1, createdAt: -1 });

module.exports = mongoose.model('Video', videoSchema);
