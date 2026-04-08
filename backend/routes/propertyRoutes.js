const express = require('express');
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routes (Provider only)
router.post('/', authMiddleware, propertyController.createProperty);
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;
