const express = require('express');
const pricingTierController = require('../controllers/pricingTierController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/:room_id', pricingTierController.getPricingTiers);

// Protected routes
router.post('/', authMiddleware, pricingTierController.createPricingTier);
router.put('/:tier_id', authMiddleware, pricingTierController.updatePricingTier);
router.delete('/:tier_id', authMiddleware, pricingTierController.deletePricingTier);
router.post('/initialize-defaults', authMiddleware, pricingTierController.initializeDefaultTiers);

module.exports = router;
