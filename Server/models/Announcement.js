const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The admin user who posted the announcement
    required: true,
  },
  visible: {
    type: Boolean,
    default: true, // Can be toggled off to hide the announcement
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
