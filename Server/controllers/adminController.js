const User = require('../models/User');
const AdminAction = require('../models/AdminAction');
const Announcement = require('../models/Announcement');
const Feedback = require('../models/Feedback');
const SwapRequest = require('../models/SwapRequest');

// Ban a user
exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.is_banned = true;
    await user.save();

    await AdminAction.create({
      type: 'ban_user',
      target_user: user._id,
      created_by: req.user._id,
      description: `User ${user.email} was banned`,
    });

    res.json({ message: 'User banned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Unban a user
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.is_banned = false;
    await user.save();

    await AdminAction.create({
      type: 'unban_user',
      target_user: user._id,
      created_by: req.user._id,
      description: `User ${user.email} was unbanned`,
    });

    res.json({ message: 'User unbanned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Post a global announcement
exports.postAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const announcement = await Announcement.create({
      message,
      created_by: req.user._id,
      visible: true,
    });

    await AdminAction.create({
      type: 'post_announcement',
      created_by: req.user._id,
      description: 'Global announcement posted',
    });

    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all swap requests (for admin monitoring)
exports.getAllSwapRequests = async (req, res) => {
  try {
    const swaps = await SwapRequest.find()
      .populate('from_user_id', 'name email')
      .populate('to_user_id', 'name email')
      .sort({ created_at: -1 });

    res.json(swaps);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all feedback entries
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('from_user_id', 'name')
      .populate('to_user_id', 'name')
      .sort({ created_at: -1 });

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Hide/disable an announcement
exports.toggleAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.announcementId);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });

    announcement.visible = !announcement.visible;
    await announcement.save();

    await AdminAction.create({
      type: 'post_announcement',
      created_by: req.user._id,
      description: `Toggled visibility for announcement: ${announcement._id}`,
    });

    res.json({ message: 'Announcement visibility updated', visible: announcement.visible });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
