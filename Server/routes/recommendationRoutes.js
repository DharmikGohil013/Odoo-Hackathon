const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// 📍 Users nearby (based on location)
router.get('/nearby', authMiddleware, recommendationController.getNearbyUsers);

// 🎯 Users with matching skills
router.get('/skills', authMiddleware, recommendationController.getSkillMatchedUsers);

// 🎓 Users from same college/company
router.get('/college', authMiddleware, recommendationController.getCollegeBasedUsers);

// 🔥 Trending skills on platform
router.get('/trending-skills', recommendationController.getTrendingSkills);

// 👥 (Optional) Mutual friends/peers (future)
router.get('/mutual/:userId', authMiddleware, recommendationController.getMutualConnections);

module.exports = router;
