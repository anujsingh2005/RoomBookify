const express = require('express');
const sustainabilityController = require('../controllers/sustainabilityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/:property_id', sustainabilityController.getSustainabilityInfo);
router.get('/', sustainabilityController.getPropertyBySustainability);
router.get('/carbon/:property_id', sustainabilityController.getCarbonSavings);

// Protected routes
router.put('/:property_id', authMiddleware, sustainabilityController.updateSustainabilityInfo);
router.post('/:property_id/submit', authMiddleware, sustainabilityController.submitForVerification);

module.exports = router;
