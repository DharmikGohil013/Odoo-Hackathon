const mongoose = require('mongoose');

const SkillItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaItem', // Each skill can include multiple media items
  }],
});

module.exports = SkillItemSchema; // NOTE: exporting as a schema, not model
