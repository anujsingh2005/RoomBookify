const { Booking, Review } = require('../models');

const parseRating = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsedValue = parseInt(value, 10);
  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return Math.min(5, Math.max(1, parsedValue));
};

exports.createReview = async (req, res) => {
  try {
    const {
      booking_id,
      rating,
      title,
      comment,
      cleanliness,
      wifi_rating,
      food_rating,
      safety_rating,
      rule_flexibility_rating,
      communication,
      location,
      value
    } = req.body;

    if (!booking_id || !rating || !title || !comment) {
      return res.status(400).json({ error: 'booking_id, rating, title, and comment are required' });
    }

    const booking = await Booking.findByPk(booking_id, {
      include: [
        {
          association: 'room',
          attributes: ['id', 'property_id'],
          include: {
            association: 'property',
            attributes: ['id', 'name']
          }
        },
        {
          association: 'review',
          attributes: ['id']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cancelled bookings cannot be reviewed' });
    }

    if (booking.review) {
      return res.status(409).json({ error: 'A review already exists for this booking' });
    }

    const stayEnded = new Date(booking.check_out) < new Date();
    if (!stayEnded) {
      return res.status(400).json({ error: 'You can review a stay only after checkout' });
    }

    const propertyId = booking.room?.property?.id || booking.room?.property_id;
    if (!propertyId) {
      return res.status(400).json({ error: 'Booking is not linked to a reviewable property' });
    }

    const review = await Review.create({
      property_id: propertyId,
      guest_id: req.user.id,
      booking_id,
      rating: parseRating(rating),
      title: String(title).trim(),
      comment: String(comment).trim(),
      cleanliness: parseRating(cleanliness),
      wifi_rating: parseRating(wifi_rating),
      food_rating: parseRating(food_rating),
      safety_rating: parseRating(safety_rating),
      rule_flexibility_rating: parseRating(rule_flexibility_rating),
      communication: parseRating(communication),
      location: parseRating(location),
      value: parseRating(value)
    });

    const createdReview = await Review.findByPk(review.id, {
      include: [
        {
          association: 'guest',
          attributes: ['id', 'name']
        },
        {
          association: 'property',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review: createdReview
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
