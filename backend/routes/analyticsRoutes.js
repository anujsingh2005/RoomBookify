const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.get('/:property_id', authMiddleware, analyticsController.getPropertyAnalytics);
router.get('/:property_id/revenue-trend', authMiddleware, analyticsController.getRevenuetrend);
router.get('/:property_id/pricing-recommendation', authMiddleware, analyticsController.getPricingRecommendation);
router.get('/:property_id/pricing-strategy', authMiddleware, analyticsController.getPricingStrategy);
router.put('/:property_id/pricing-strategy', authMiddleware, analyticsController.updatePricingStrategy);

module.exports = router;
