const { User, Booking, Room, Property, Review, LoyaltyPoint, Referral, Message } = require('../models');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          association: 'bookings',
          attributes: ['id', 'status', 'check_in', 'check_out', 'total_price'],
          include: {
            association: 'room',
            attributes: ['room_type', 'price_per_night'],
            include: {
              association: 'property',
              attributes: ['id', 'name', 'address']
            }
          },
          limit: 5,
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    const where = status ? { status } : {};

    const bookings = await Booking.findAll({
      where: { user_id: req.user.id, ...where },
      include: [
        {
          association: 'room',
          attributes: ['id', 'room_type', 'price_per_night', 'total_beds', 'available_beds'],
          include: {
            association: 'property',
            attributes: [
              'id',
              'name',
              'address',
              'type',
              'commute_landmark',
              'commute_minutes',
              'preferred_for',
              'move_in_assurance'
            ]
          }
        },
        {
          association: 'review',
          attributes: [
            'id',
            'rating',
            'title',
            'comment',
            'wifi_rating',
            'food_rating',
            'safety_rating',
            'rule_flexibility_rating'
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalBookings = await Booking.count({
      where: { user_id: req.user.id, ...where }
    });

    // Categorize bookings
    const currentDate = new Date();
    const categorizedBookings = {
      upcoming: [],
      current: [],
      completed: [],
      cancelled: []
    };

    bookings.forEach(booking => {
      if (booking.status === 'cancelled') {
        categorizedBookings.cancelled.push(booking);
      } else if (new Date(booking.check_out) < currentDate) {
        categorizedBookings.completed.push(booking);
      } else if (new Date(booking.check_in) <= currentDate && new Date(booking.check_out) >= currentDate) {
        categorizedBookings.current.push(booking);
      } else {
        categorizedBookings.upcoming.push(booking);
      }
    });

    res.json({
      total: totalBookings,
      bookings,
      categorized: categorizedBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserLoyaltyInfo = async (req, res) => {
  try {
    const loyalty = await LoyaltyPoint.findOne({ where: { user_id: req.user.id } });

    if (!loyalty) {
      return res.status(404).json({ error: 'Loyalty information not found' });
    }

    res.json(loyalty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserReferralInfo = async (req, res) => {
  try {
    const referrals = await Referral.findAll({
      where: { referrer_id: req.user.id }
    });

    const completedReferrals = referrals.filter(r => r.status === 'completed').length;

    res.json({
      total_referrals: referrals.length,
      completed_referrals: completedReferrals,
      pending_referrals: referrals.filter(r => r.status === 'pending').length,
      total_earnings: completedReferrals * 500,
      referrals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserConversations = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { [require('sequelize').Op.or]: [{ sender_id: req.user.id }, { receiver_id: req.user.id }] },
      include: [
        {
          association: 'sender',
          attributes: ['id', 'name', 'googleProfilePicture']
        },
        {
          association: 'receiver',
          attributes: ['id', 'name', 'googleProfilePicture']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    // Group by conversation
    const conversations = {};
    messages.forEach(msg => {
      const otherUserId = msg.sender_id === req.user.id ? msg.receiver_id : msg.sender_id;
      const otherUser = msg.sender_id === req.user.id ? msg.receiver : msg.sender;

      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          user_id: otherUserId,
          name: otherUser.name,
          profile_picture: otherUser.googleProfilePicture,
          last_message: msg.message,
          last_message_time: msg.createdAt
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserStatistics = async (req, res) => {
  try {
    const totalBookings = await Booking.count({ where: { user_id: req.user.id } });
    const completedBookings = await Booking.count({
      where: { user_id: req.user.id, status: 'completed' }
    });
    const cancelledBookings = await Booking.count({
      where: { user_id: req.user.id, status: 'cancelled' }
    });

    const totalSpent = await Booking.findAll({
      where: { user_id: req.user.id, status: { [require('sequelize').Op.not]: 'cancelled' } },
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('total_price')), 'total']
      ],
      raw: true
    });

    const loyalty = await LoyaltyPoint.findOne({ where: { user_id: req.user.id } });

    const referrals = await Referral.findAll({ where: { referrer_id: req.user.id } });

    res.json({
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      },
      spending: {
        total: parseFloat(totalSpent[0]?.total || 0)
      },
      loyalty: {
        points: loyalty?.points || 0,
        tier: loyalty?.tier || 'bronze'
      },
      referrals: {
        total: referrals.length,
        completed: referrals.filter(r => r.status === 'completed').length,
        earnings: referrals.filter(r => r.status === 'completed').length * 500
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
