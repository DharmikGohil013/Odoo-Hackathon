const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getGroupMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  getUnreadCount
} = require('../controllers/messageController');

// All routes require authentication
router.use(authMiddleware);

// Get messages for a group
router.get('/group/:groupId', getGroupMessages);

// Send a message to a group
router.post('/group/:groupId', sendMessage);

// Edit a message
router.put('/:messageId', editMessage);

// Delete a message
router.delete('/:messageId', deleteMessage);

// Add reaction to a message
router.post('/:messageId/reaction', addReaction);

// Remove reaction from a message
router.delete('/:messageId/reaction', removeReaction);

// Get unread message count for a group
router.get('/group/:groupId/unread', getUnreadCount);

module.exports = router;
