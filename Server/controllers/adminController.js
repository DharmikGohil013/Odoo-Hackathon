const User = require('../models/User');
const AdminAction = require('../models/AdminAction');
const Announcement = require('../models/Announcement');
const Feedback = require('../models/Feedback');
const SkillItem = require('../models/SkillItem');
const SwapRequest = require('../models/SwapRequest');
const { Parser } = require('json2csv');

// Ban a user
exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_banned: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    await AdminAction.create({
      type: 'ban_user',
      target_user: user._id,
      description: `Banned by admin ${req.user._id}`,
      created_by: req.user._id,
    });
    res.json({ message: 'User banned' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Unban a user
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_banned: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    await AdminAction.create({
      type: 'unban_user',
      target_user: user._id,
      description: `Unbanned by admin ${req.user._id}`,
      created_by: req.user._id,
    });
    res.json({ message: 'User unbanned' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Approve a skill (mark as approved)
exports.approveSkill = async (req, res) => {
  try {
    const skill = await SkillItem.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    await AdminAction.create({
      type: 'approve_skill',
      target_user: skill.user_id,
      description: `Skill approved by admin ${req.user._id}`,
      created_by: req.user._id,
    });
    res.json({ message: 'Skill approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject a skill (mark as not approved)
exports.rejectSkill = async (req, res) => {
  try {
    const skill = await SkillItem.findByIdAndUpdate(
      req.params.id,
      { approved: false },
      { new: true }
    );
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    await AdminAction.create({
      type: 'reject_skill',
      target_user: skill.user_id,
      description: `Skill rejected by admin ${req.user._id}`,
      created_by: req.user._id,
    });
    res.json({ message: 'Skill rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete inappropriate feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    await AdminAction.create({
      type: 'delete_feedback',
      target_user: feedback.to_user_id,
      description: `Feedback deleted by admin ${req.user._id}`,
      created_by: req.user._id,
    });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Post a platform-wide announcement
exports.postAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });
    const announcement = await Announcement.create({
      message,
      created_by: req.user._id,
      visible: true
    });
    await AdminAction.create({
      type: 'post_announcement',
      description: `Announcement posted by admin ${req.user._id}`,
      created_by: req.user._id,
    });
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Download platform activity/user/feedback/swap reports (CSV)
exports.getReports = async (req, res) => {
  try {
    const users = await User.find().lean();
    const swaps = await SwapRequest.find().lean();
    const feedbacks = await Feedback.find().lean();

    // You could send as CSV files, here as JSON for simplicity
    res.json({
      users,
      swaps,
      feedbacks
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
