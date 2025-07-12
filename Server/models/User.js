const mongoose = require('mongoose');
const SkillItemSchema = require('./SkillItem'); // Subdocument

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  college_or_company: {
    type: String,
    default: '',
  },
  profile_photo: {
    type: String, // Cloudinary or static URL
    default: '',
  },
  availability: {
    type: String, // e.g. "Weekends", "Evenings"
    default: '',
  },
  is_public: {
    type: Boolean,
    default: true,
  },
  is_banned: {
    type: Boolean,
    default: false,
  },

  // Social features
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  blocked_users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  // Group system
  groups_joined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],

  // Skills
  skills_offered: [SkillItemSchema],
  skills_wanted: [SkillItemSchema],

  rating: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
