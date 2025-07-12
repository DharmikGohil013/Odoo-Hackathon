const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['image', 'pdf', 'document', 'spreadsheet', 'presentation', 'other'],
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
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
  downloads: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for URL
fileSchema.virtual('url').get(function() {
  return this.cloudinaryUrl;
});

// Ensure virtual fields are serialized
fileSchema.set('toJSON', {
  virtuals: true
});

// Index for search
fileSchema.index({ title: 'text', originalName: 'text' });
fileSchema.index({ uploadedBy: 1, createdAt: -1 });
fileSchema.index({ type: 1 });

module.exports = mongoose.model('File', fileSchema);
