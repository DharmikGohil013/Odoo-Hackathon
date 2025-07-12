const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxlength: 500
  },
  icon: {
    type: String, // URL to group icon (Cloudinary or static image)
    default: '',
  },
  is_public: {
    type: Boolean,
    default: true, // true = anyone can find & join; false = invite only
  },
  created_by: { // Keep original field name for compatibility
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags: [{
    type: String,
    trim: true
  }],
  settings: {
    allowMemberInvites: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    chatEnabled: {
      type: Boolean,
      default: true
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total member count
GroupSchema.virtual('memberCount').get(function() {
  return this.members.length + (this.admins?.length || 0) + 1; // +1 for creator
});

// Virtual to check if group is active (has recent activity)
GroupSchema.virtual('isActive').get(function() {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.lastActivity > oneWeekAgo;
});

// Index for better search performance
GroupSchema.index({ name: 'text', description: 'text', tags: 'text' });
GroupSchema.index({ is_public: 1, created_at: -1 });
GroupSchema.index({ created_by: 1 });
GroupSchema.index({ members: 1 });
GroupSchema.index({ admins: 1 });

// Method to check if user is a member
GroupSchema.methods.isMember = function(userId) {
  return this.members.includes(userId) || 
         (this.admins && this.admins.includes(userId)) || 
         this.created_by.toString() === userId.toString();
};

// Method to check if user is an admin
GroupSchema.methods.isAdmin = function(userId) {
  return (this.admins && this.admins.includes(userId)) || 
         this.created_by.toString() === userId.toString();
};

// Method to add member
GroupSchema.methods.addMember = function(userId) {
  if (!this.isMember(userId)) {
    this.members.push(userId);
    this.lastActivity = new Date();
  }
};

// Method to remove member
GroupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => member.toString() !== userId.toString());
  if (this.admins) {
    this.admins = this.admins.filter(admin => admin.toString() !== userId.toString());
  }
};

// Method to promote to admin
GroupSchema.methods.promoteToAdmin = function(userId) {
  if (this.isMember(userId) && !this.isAdmin(userId)) {
    this.members = this.members.filter(member => member.toString() !== userId.toString());
    if (!this.admins) this.admins = [];
    this.admins.push(userId);
  }
};

// Pre-save middleware to update lastActivity and updated_at
GroupSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActivity = new Date();
    this.updated_at = new Date();
  }
  next();
});

module.exports = mongoose.model('Group', GroupSchema);
