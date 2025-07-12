const mongoose = require('mongoose');

const AdminActionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'ban_user',
      'unban_user',
      'delete_skill',
      'approve_skill',
      'reject_skill',
      'post_announcement',
      'delete_feedback',
      'send_report',
      'warn_user',
    ],
  },
  target_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming admins are users with admin role
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AdminAction', AdminActionSchema);
