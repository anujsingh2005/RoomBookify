const { Booking, Room, Property, LoyaltyPoint, PricingTier, sequelize } = require('../models');

exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { room_id, beds_booked, check_in, check_out } = req.body;

    if (!room_id || !beds_booked || !check_in || !check_out) {
      await transaction.rollback();
      return res.status(400).json({ error: 'room_id, beds_booked, check_in, and check_out are required' });
    }

    // Pessimistic Locking: Lock the room row for read-write operations
    const room = await Room.findByPk(room_id, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    if (!room) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check availability
    if (room.available_beds < beds_booked) {
      await transaction.rollback();
      return res.status(409).json({
        error: `Only ${room.available_beds} bed(s) available in this room`
      });
    }

    // Calculate nights and total price with extended stay discounts
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Check for pricing tiers to apply discounts
    let discountPercentage = 0;
    const pricingTier = await PricingTier.findOne({
      where: {
        room_id,
        nights_min: { [sequelize.Sequelize.Op.lte]: nights },
        nights_max: { [sequelize.Sequelize.Op.gte]: nights }
      }
    }, { transaction });

    if (pricingTier) {
      discountPercentage = pricingTier.discount_percentage;
    } else {
      // Apply default extended stay discount if no tier found
      if (nights >= 90) discountPercentage = 35;
      else if (nights >= 30) discountPercentage = 20;
      else if (nights >= 7) discountPercentage = 10;
    }

    const pricePerNight = room.price_per_night * (1 - discountPercentage / 100);
    const totalPrice = pricePerNight * nights * beds_booked;

    // Create booking
    const booking = await Booking.create({
      user_id: req.user.id,
      room_id,
      beds_booked,
      check_in,
      check_out,
      total_price: totalPrice,
      status: 'confirmed'
    }, { transaction });

    // Update available beds
    await room.update(
      { available_beds: room.available_beds - beds_booked },
      { transaction }
    );

    // Award loyalty points: 1 point per ₹1 spent
    const pointsEarned = Math.round(totalPrice);
    let loyalty = await LoyaltyPoint.findOne({ where: { user_id: req.user.id } }, { transaction });
    if (loyalty) {
      loyalty.points += pointsEarned;
      loyalty.total_earned += pointsEarned;

      // Update tier
      if (loyalty.total_earned >= 50000) loyalty.tier = 'platinum';
      else if (loyalty.total_earned >= 25000) loyalty.tier = 'gold';
      else if (loyalty.total_earned >= 10000) loyalty.tier = 'silver';
      else loyalty.tier = 'bronze';

      await loyalty.save({ transaction });
    } else {
      await LoyaltyPoint.create({
        user_id: req.user.id,
        points: pointsEarned,
        total_earned: pointsEarned,
        tier: 'bronze'
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking: {
        id: booking.id,
        room_id,
        check_in,
        check_out,
        beds_booked,
        nights,
        discount_percentage: discountPercentage,
        price_per_night_original: room.price_per_night,
        price_per_night: pricePerNight,
        total_price: totalPrice,
        status: booking.status,
        loyalty_points_earned: pointsEarned
      }
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { association: 'user', attributes: ['id', 'name', 'email'] },
        {
          association: 'room',
          attributes: ['id', 'room_type', 'price_per_night'],
          include: { association: 'property', attributes: ['id', 'name', 'address'] }
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          association: 'room',
          attributes: ['id', 'room_type', 'price_per_night'],
          include: { association: 'property', attributes: ['id', 'name', 'address'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPropertyBookings = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Verify ownership
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const bookings = await Booking.findAll({
      include: [
        { association: 'user', attributes: ['id', 'name', 'email'] },
        {
          association: 'room',
          where: { property_id: propertyId },
          attributes: ['id', 'room_type', 'price_per_night']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const booking = await Booking.findByPk(req.params.id, { transaction });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.user_id !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    // Release beds back to room
    const room = await Room.findByPk(booking.room_id, {
      lock: transaction.LOCK.UPDATE,
      transaction
    });

    await room.update(
      { available_beds: room.available_beds + booking.beds_booked },
      { transaction }
    );

    await booking.update({ status: 'cancelled' }, { transaction });

    await transaction.commit();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
