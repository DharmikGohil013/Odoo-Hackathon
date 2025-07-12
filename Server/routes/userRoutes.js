const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

// 👤 Get current user's profile
router.get('/me', authMiddleware, userController.getMyProfile);

// ✏️ Update profile info (name, location, etc.)
router.put('/me', authMiddleware, userController.updateProfile);

// 🛡️ Toggle public/private profile
router.patch('/me/privacy', authMiddleware, userController.togglePrivacy);

// 🛠️ Update skills offered/wanted
router.put('/me/skills', authMiddleware, userController.updateSkills);

// 🧑‍🤝‍🧑 Add a friend
router.post('/:id/friend', authMiddleware, userController.addFriend);

// 🗑️ Remove a friend
router.delete('/:id/friend', authMiddleware, userController.removeFriend);

// 🚫 Block a user
router.post('/:id/block', authMiddleware, userController.blockUser);

// 🔓 Unblock a user
router.delete('/:id/block', authMiddleware, userController.unblockUser);

// 🌍 Get all public users (directory/browse)
router.get('/', userController.getPublicUsers);

// 👁️ View a user's public profile by ID
router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;
