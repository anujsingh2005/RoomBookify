const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/send', authMiddleware, messageController.sendMessage);
router.get('/conversation/:user_id', authMiddleware, messageController.getConversation);
router.get('/conversations', authMiddleware, messageController.getConversations);
router.get('/unread-count', authMiddleware, messageController.getUnreadCount);
router.patch('/:message_id/read', authMiddleware, messageController.markAsRead);
router.post('/send-checkin', authMiddleware, messageController.sendCheckInInfo);

module.exports = router;
