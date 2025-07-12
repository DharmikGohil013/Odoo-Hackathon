const Group = require('../models/Group');
const User = require('../models/User');

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, is_public, icon } = req.body;

    if (!name || !description)
      return res.status(400).json({ message: 'Name and description are required' });

    const group = await Group.create({
      name,
      description,
      is_public: is_public !== undefined ? is_public : true,
      icon: icon || '',
      members: [req.user._id],
      created_by: req.user._id,
    });

    // Add this group to user's groups_joined
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { groups_joined: group._id } });

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all public groups
exports.getPublicGroups = async (req, res) => {
  try {
    const groups = await Group.find({ is_public: true }).populate('created_by', 'name');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get group details by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name profile_photo')
      .populate('created_by', 'name');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Join a group
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { groups_joined: group._id } });
    }
    res.json({ message: 'Joined group', groupId: group._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Leave a group
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.members = group.members.filter((id) => id.toString() !== req.user._id.toString());
    await group.save();

    await User.findByIdAndUpdate(req.user._id, { $pull: { groups_joined: group._id } });

    res.json({ message: 'Left group', groupId: group._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a group (only creator can)
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (group.created_by.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only the group creator can delete the group.' });

    // Remove group from all users' groups_joined
    await User.updateMany({ groups_joined: group._id }, { $pull: { groups_joined: group._id } });

    await group.remove();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get members of a group
exports.getGroupMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name profile_photo');
    if (!group) return res.status(404).json({ message: 'Group not found' });
    res.json(group.members);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
