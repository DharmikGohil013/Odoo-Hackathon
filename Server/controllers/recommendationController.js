const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');

// @desc    Recommend users based on skills, location, college
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const recommendations = await User.find({
      _id: { $ne: currentUser._id }, // exclude self
      is_public: true,
      is_banned: false,
      $or: [
        // Skill Match
        { 'skills_offered.name': { $in: currentUser.skills_wanted.map(s => s.name) } },
        { 'skills_wanted.name': { $in: currentUser.skills_offered.map(s => s.name) } },

        // Location Match
        { location: currentUser.location },

        // College/Company Match
        { college_or_company: currentUser.college_or_company },
      ],
    })
      .select('name profile_photo skills_offered location college_or_company rating')
      .limit(20);

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get trending skill tags (most used in all users)
// @route   GET /api/recommendations/trending-skills
// @access  Public
exports.getTrendingSkills = async (req, res) => {
  try {
    const skillCounts = {};

    const allUsers = await User.find({}, 'skills_offered');

    allUsers.forEach((user) => {
      user.skills_offered.forEach((skill) => {
        const skillName = skill.name.trim().toLowerCase();
        skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
      });
    });

    const trending = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    res.json(trending);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get mutual skill matches between two users
// @route   GET /api/recommendations/match/:otherUserId
// @access  Private
exports.getSkillMatchWithUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const otherUser = await User.findById(req.params.otherUserId);

    if (!currentUser || !otherUser)
      return res.status(404).json({ message: 'One of the users not found' });

    const youWant = currentUser.skills_wanted.map(s => s.name.toLowerCase());
    const youHave = currentUser.skills_offered.map(s => s.name.toLowerCase());

    const theyWant = otherUser.skills_wanted.map(s => s.name.toLowerCase());
    const theyHave = otherUser.skills_offered.map(s => s.name.toLowerCase());

    const youMatch = theyHave.filter(skill => youWant.includes(skill));
    const theyMatch = youHave.filter(skill => theyWant.includes(skill));

    res.json({
      mutual_swap_possible: youMatch.length > 0 && theyMatch.length > 0,
      skills_you_want_from_them: youMatch,
      skills_they_want_from_you: theyMatch,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
