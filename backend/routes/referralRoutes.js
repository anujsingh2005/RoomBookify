const express = require('express');
const referralController = require('../controllers/referralController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/generate-code', authMiddleware, referralController.generateReferralCode);
router.post('/apply-code', authMiddleware, referralController.applyReferralCode);
router.get('/stats', authMiddleware, referralController.getReferralStats);

module.exports = router;
