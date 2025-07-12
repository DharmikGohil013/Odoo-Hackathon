const Message = require('../models/Message');
const Group = require('../models/Group');
const User = require('../models/User');

// Get group messages with pagination
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Check if user is member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.isMember(userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this group.' });
    }

    const messages = await Message.getGroupMessages(groupId, parseInt(page), parseInt(limit));
    
    // Mark messages as read by current user
    await Message.updateMany(
      { 
        group: groupId, 
        'readBy.user': { $ne: userId },
        sender: { $ne: userId }
      },
      { 
        $push: { readBy: { user: userId, readAt: new Date() } }
      }
    );

    const totalMessages = await Message.countDocuments({ group: groupId, isDeleted: false });
    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMessages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, messageType = 'text', replyTo } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Check if user is member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.isMember(userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this group.' });
    }

    // Create new message
    const messageData = {
      content: content.trim(),
      sender: userId,
      group: groupId,
      messageType,
      readBy: [{ user: userId, readAt: new Date() }] // Mark as read by sender
    };

    if (replyTo) {
      const originalMessage = await Message.findById(replyTo);
      if (originalMessage && originalMessage.group.toString() === groupId) {
        messageData.replyTo = replyTo;
      }
    }

    const message = new Message(messageData);
    await message.save();

    // Populate the message before sending response
    await message.populate('sender', 'name email profilePicture');
    if (message.replyTo) {
      await message.populate('replyTo', 'content sender');
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Edit a message
const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'You can only edit your own messages' });
    }

    // Check if message is not too old (e.g., 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (message.createdAt < fifteenMinutesAgo) {
      return res.status(400).json({ message: 'Message is too old to edit' });
    }

    message.content = content.trim();
    await message.save();

    await message.populate('sender', 'name email profilePicture');
    if (message.replyTo) {
      await message.populate('replyTo', 'content sender');
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error editing message', error: error.message });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender or group admin
    const group = await Group.findById(message.group);
    const isAdmin = group.isAdmin(userId);
    const isSender = message.sender.toString() === userId;

    if (!isAdmin && !isSender) {
      return res.status(403).json({ message: 'Access denied' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = 'This message was deleted';
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};

// Add reaction to message
const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user has access to the group
    const group = await Group.findById(message.group);
    const isMember = group.isMember(userId);
    if (!isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const added = message.addReaction(userId, emoji);
    if (!added) {
      return res.status(400).json({ message: 'You have already reacted with this emoji' });
    }

    await message.save();
    await message.populate('reactions.user', 'name');

    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ message: 'Error adding reaction', error: error.message });
  }
};

// Remove reaction from message
const removeReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.removeReaction(userId, emoji);
    await message.save();
    await message.populate('reactions.user', 'name');

    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ message: 'Error removing reaction', error: error.message });
  }
};

// Get unread message count for user in group
const getUnreadCount = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const unreadCount = await Message.countDocuments({
      group: groupId,
      sender: { $ne: userId },
      'readBy.user': { $ne: userId },
      isDeleted: false
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Error getting unread count', error: error.message });
  }
};

module.exports = {
  getGroupMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  getUnreadCount
};
