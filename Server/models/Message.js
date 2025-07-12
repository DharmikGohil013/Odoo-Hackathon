const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String,
    fileSize: Number
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
messageSchema.index({ group: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ 'readBy.user': 1 });

// Virtual for formatting creation date
messageSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleString();
});

// Method to check if message is read by user
messageSchema.methods.isReadByUser = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Method to add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  const existingReaction = this.reactions.find(
    reaction => reaction.user.toString() === userId.toString() && reaction.emoji === emoji
  );
  
  if (existingReaction) {
    return false; // Already reacted with this emoji
  }
  
  this.reactions.push({ user: userId, emoji });
  return true;
};

// Method to remove reaction
messageSchema.methods.removeReaction = function(userId, emoji) {
  this.reactions = this.reactions.filter(
    reaction => !(reaction.user.toString() === userId.toString() && reaction.emoji === emoji)
  );
};

// Pre-save middleware to update editedAt when content is modified
messageSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

// Static method to get messages with pagination
messageSchema.statics.getGroupMessages = function(groupId, page = 1, limit = 50) {
  return this.find({ 
    group: groupId, 
    isDeleted: false 
  })
  .populate('sender', 'name email profilePicture')
  .populate('replyTo', 'content sender')
  .populate('reactions.user', 'name')
  .sort({ createdAt: -1 })
  .limit(limit * 1)
  .skip((page - 1) * limit)
  .exec();
};

module.exports = mongoose.model('Message', messageSchema);
