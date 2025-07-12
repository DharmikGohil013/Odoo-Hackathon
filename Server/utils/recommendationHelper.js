const User = require('../models/User');

// Recommend users who match the current user's skill needs
exports.recommendSkillMatches = async (currentUser, limit = 10) => {
  if (!currentUser) return [];

  const skillNamesWanted = currentUser.skills_wanted.map(s => s.name);

  // Find users who offer what this user wants, and are not self/banned/private
  const matches = await User.find({
    _id: { $ne: currentUser._id },
    is_public: true,
    is_banned: false,
    'skills_offered.name': { $in: skillNamesWanted },
  })
    .select('name profile_photo skills_offered location college_or_company rating')
    .limit(limit);

  return matches;
};

// Recommend users from the same city, state, or location
exports.recommendByLocation = async (currentUser, limit = 10) => {
  if (!currentUser || !currentUser.location) return [];

  const users = await User.find({
    _id: { $ne: currentUser._id },
    is_public: true,
    is_banned: false,
    location: currentUser.location,
  })
    .select('name profile_photo skills_offered location rating')
    .limit(limit);

  return users;
};

// Recommend users from same college or company
exports.recommendByCollegeOrCompany = async (currentUser, limit = 10) => {
  if (!currentUser || !currentUser.college_or_company) return [];

  const users = await User.find({
    _id: { $ne: currentUser._id },
    is_public: true,
    is_banned: false,
    college_or_company: currentUser.college_or_company,
  })
    .select('name profile_photo skills_offered college_or_company rating')
    .limit(limit);

  return users;
};

// Get trending skill tags (top N used skills)
exports.getTrendingSkills = async (topN = 10) => {
  // Aggregate over all users' skills_offered to find most common skills
  const result = await User.aggregate([
    { $unwind: '$skills_offered' },
    { $group: { _id: '$skills_offered.name', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: topN },
    { $project: { name: '$_id', count: 1, _id: 0 } }
  ]);
  return result;
};

// Find users with mutual skill swap possible
exports.getMutualSkillMatches = async (currentUser, otherUser) => {
  if (!currentUser || !otherUser) return {};

  const userWants = currentUser.skills_wanted.map(s => s.name.toLowerCase());
  const userHas = currentUser.skills_offered.map(s => s.name.toLowerCase());
  const otherWants = otherUser.skills_wanted.map(s => s.name.toLowerCase());
  const otherHas = otherUser.skills_offered.map(s => s.name.toLowerCase());

  const canLearnFromOther = otherHas.filter(skill => userWants.includes(skill));
  const canTeachOther = userHas.filter(skill => otherWants.includes(skill));

  return {
    canLearnFromOther, // skills you want from them
    canTeachOther,     // skills they want from you
    isPerfectSwap: canLearnFromOther.length > 0 && canTeachOther.length > 0
  };
};
