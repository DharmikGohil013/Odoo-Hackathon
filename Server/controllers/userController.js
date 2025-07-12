const User = require('../models/User');

// @desc    Get logged-in user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update profile (name, location, etc.)
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res) => {    // <-- Name changed here!
  try {
    const updates = {
      name: req.body.name,
      location: req.body.location,
      college_or_company: req.body.college_or_company,
      availability: req.body.availability,
      profile_photo: req.body.profile_photo,
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update skills offered/wanted
// @route   PUT /api/users/me/skills
// @access  Private
exports.updateSkills = async (req, res) => {
  try {
    const { skills_offered, skills_wanted } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.skills_offered = skills_offered || [];
    user.skills_wanted = skills_wanted || [];

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Set profile to public or private
// @route   PATCH /api/users/me/privacy
// @access  Private
exports.togglePrivacy = async (req, res) => {
  try {
    const { is_public } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { is_public },
      { new: true }
    );
    res.json({ message: `Profile set to ${is_public ? 'public' : 'private'}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all public users for discovery/search
// @route   GET /api/users
// @access  Public
exports.getPublicUsers = async (req, res) => {
  try {
    const users = await User.find({ is_public: true, is_banned: false })
      .select('name profile_photo skills_offered location availability rating')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Add a friend
// @route   POST /api/users/:id/friend
// @access  Private
exports.addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const friend = await User.findById(req.params.id);

    if (!friend || friend._id.equals(user._id)) {
      return res.status(400).json({ message: 'Invalid user to add as friend' });
    }

    if (!user.friends.includes(friend._id)) {
      user.friends.push(friend._id);
      await user.save();
    }

    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Remove a friend
// @route   DELETE /api/users/:id/friend
// @access  Private
exports.removeFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.friends = user.friends.filter(
      (id) => id.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Block a user
// @route   POST /api/users/:id/block
// @access  Private
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.blocked_users.includes(req.params.id)) {
      user.blocked_users.push(req.params.id);
      await user.save();
    }
    res.json({ message: 'User blocked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Unblock a user
// @route   DELETE /api/users/:id/block
// @access  Private
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.blocked_users = user.blocked_users.filter(
      (id) => id.toString() !== req.params.id
    );
    await user.save();
    res.json({ message: 'User unblocked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// @desc    Get a public user profile by ID
// @route   GET /api/users/:id
// @access  Private (or public if you want)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .lean();
    if (!user || user.is_banned || !user.is_public)
      return res.status(404).json({ message: 'User not found or not public' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
