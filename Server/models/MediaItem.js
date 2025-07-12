const mongoose = require('mongoose');

const MediaItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['image', 'video', 'audio', 'file', 'canvas'],
  },
  url: {
    type: String,
    required: true, // Cloudinary or any public media URL
  },
  filename: {
    type: String,
    default: '',
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MediaItem', MediaItemSchema);
