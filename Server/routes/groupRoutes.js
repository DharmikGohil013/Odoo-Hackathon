const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authMiddleware } = require('../middleware/authMiddleware');

// 📁 Create a new group
router.post('/', authMiddleware, groupController.createGroup);

// 🌐 Get all public groups
router.get('/', groupController.getPublicGroups);

// 🔍 Get single group details by ID
router.get('/:id', groupController.getGroupById);

// ➕ Join a group
router.post('/:id/join', authMiddleware, groupController.joinGroup);

// ➖ Leave a group
router.post('/:id/leave', authMiddleware, groupController.leaveGroup);

// ❌ Delete a group (only creator can)
router.delete('/:id', authMiddleware, groupController.deleteGroup);

// 👥 Get members of a group
router.get('/:id/members', authMiddleware, groupController.getGroupMembers);

module.exports = router;
