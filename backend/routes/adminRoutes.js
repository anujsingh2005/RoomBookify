const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create middleware to check admin
const checkAdmin = async (req, res, next) => {
  const { User } = require('../models');
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin routes (protected)
router.get('/dashboard/stats', authMiddleware, checkAdmin, adminController.getDashboardStats);

router.get('/users', authMiddleware, checkAdmin, adminController.getAllUsers);
router.get('/users/:userId', authMiddleware, checkAdmin, adminController.getUser);
router.put('/users/:userId/role', authMiddleware, checkAdmin, adminController.updateUserRole);
router.delete('/users/:userId', authMiddleware, checkAdmin, adminController.deleteUser);

router.get('/properties', authMiddleware, checkAdmin, adminController.getAllProperties);

router.get('/bookings', authMiddleware, checkAdmin, adminController.getAllBookings);

router.get('/analytics/revenue', authMiddleware, checkAdmin, adminController.getRevenueAnalytics);
router.get('/analytics/providers', authMiddleware, checkAdmin, adminController.getProviderStats);

module.exports = router;
