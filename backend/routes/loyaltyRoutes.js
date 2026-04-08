const express = require('express');
const loyaltyController = require('../controllers/loyaltyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.get('/my-loyalty', authMiddleware, loyaltyController.getUserLoyalty);
router.post('/add-points', authMiddleware, loyaltyController.addPoints);
router.post('/redeem-points', authMiddleware, loyaltyController.redeemPoints);

module.exports = router;
