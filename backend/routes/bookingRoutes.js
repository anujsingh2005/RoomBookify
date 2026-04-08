const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (User only)
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/user/bookings', authMiddleware, bookingController.getUserBookings);
router.get('/:id', authMiddleware, bookingController.getBooking);
router.delete('/:id/cancel', authMiddleware, bookingController.cancelBooking);

// Provider routes
router.get('/property/:propertyId/bookings', authMiddleware, bookingController.getPropertyBookings);

module.exports = router;
