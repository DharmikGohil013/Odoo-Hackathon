const Group = require('../models/Group');
const AdminAction = require('../models/AdminAction');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const { name, description, is_public, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Group name is required' });
    }

    const group = await Group.create({
      name,
      description,
      icon,
      is_public,
      created_by: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all groups (public or user is a member)
// @route   GET /api/groups
// @access  Public
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { is_public: true },
        { members: req.user._id },
      ],
    }).sort({ created_at: -1 });

    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:groupId
// @access  Public/Private (depends on group visibility)
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members', 'name profile_photo');

    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Check access
    if (!group.is_public && !group.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'This is a private group' });
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Join a group
// @route   POST /api/groups/:groupId/join
// @access  Private
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.is_public) {
      return res.status(403).json({ message: 'This group is private and cannot be joined directly' });
    }

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }

    res.json({ message: 'Joined group successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Leave a group
// @route   POST /api/groups/:groupId/leave
// @access  Private
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.members = group.members.filter(
      (memberId) => String(memberId) !== String(req.user._id)
    );
    await group.save();

    res.json({ message: 'Left group successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete a group (admin only)
// @route   DELETE /api/groups/:groupId
// @access  Admin
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    await Group.findByIdAndDelete(req.params.groupId);

    await AdminAction.create({
      type: 'delete_group',
      created_by: req.user._id,
      description: `Deleted group: ${group.name}`,
    });

    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
