const express = require('express');
const userProfileController = require('../controllers/userProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.get('/profile', authMiddleware, userProfileController.getUserProfile);
router.get('/bookings', authMiddleware, userProfileController.getUserBookings);
router.get('/loyalty', authMiddleware, userProfileController.getUserLoyaltyInfo);
router.get('/referrals', authMiddleware, userProfileController.getUserReferralInfo);
router.get('/conversations', authMiddleware, userProfileController.getUserConversations);
router.get('/statistics', authMiddleware, userProfileController.getUserStatistics);
router.put('/profile', authMiddleware, userProfileController.updateUserProfile);

module.exports = router;
