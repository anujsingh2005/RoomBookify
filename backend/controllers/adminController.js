const { User, Property, Booking, Room, LoyaltyPoint, Referral, Message } = require('../models');
const { Op } = require('sequelize');

// Middleware to check if user is admin
exports.checkAdmin = async (req, res, next) => {
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

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalProviders = await User.count({ where: { role: 'provider' } });
    const totalSeekers = await User.count({ where: { role: 'seeker' } });

    const totalProperties = await Property.count();
    const totalRooms = await Room.count();

    const totalBookings = await Booking.count();
    const completedBookings = await Booking.count({ where: { status: 'completed' } });
    const confirmedBookings = await Booking.count({ where: { status: 'confirmed' } });
    const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } });

    const totalRevenue = await Booking.findAll({
      where: { status: 'completed' },
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('total_price')), 'total']
      ],
      raw: true
    });

    const monthlyRevenue = await Booking.findAll({
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('total_price')), 'total']
      ],
      raw: true
    });

    const totalLoyaltyPoints = await LoyaltyPoint.findAll({
      attributes: [
        [require('sequelize').fn('SUM', require('sequelize').col('points')), 'total']
      ],
      raw: true
    });

    res.json({
      users: {
        total: totalUsers,
        providers: totalProviders,
        seekers: totalSeekers
      },
      properties: {
        total: totalProperties,
        rooms: totalRooms
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        cancellation_rate: totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(2) : 0
      },
      revenue: {
        total: parseFloat(totalRevenue[0]?.total || 0),
        monthly: parseFloat(monthlyRevenue[0]?.total || 0)
      },
      loyalty_points: {
        total: parseFloat(totalLoyaltyPoints[0]?.total || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, limit = 10, offset = 0, search } = req.query;

    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const total = await User.count({ where });

    res.json({ users, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          association: 'bookings',
          attributes: ['id', 'status', 'check_in', 'check_out', 'total_price'],
          limit: 5,
          order: [['createdAt', 'DESC']]
        },
        {
          association: 'properties',
          attributes: ['id', 'name', 'category'],
          limit: 5
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

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['seeker', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete associated data
    await Booking.destroy({ where: { user_id: userId } });
    await LoyaltyPoint.destroy({ where: { user_id: userId } });
    await Referral.destroy({ where: { [Op.or]: [{ referrer_id: userId }, { referred_id: userId }] } });
    await Message.destroy({ where: { [Op.or]: [{ sender_id: userId }, { receiver_id: userId }] } });

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search, category } = req.query;

    const where = {};
    if (search) where.name = { [Op.like]: `%${search}%` };
    if (category) where.category = category;

    const properties = await Property.findAll({
      where,
      include: {
        association: 'provider',
        attributes: ['id', 'name', 'email']
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const total = await Property.count({ where });

    res.json({ properties, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    const where = status ? { status } : {};

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          association: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          association: 'room',
          attributes: ['room_type'],
          include: {
            association: 'property',
            attributes: ['name']
          }
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const total = await Booking.count({ where });

    res.json({ bookings, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    const dailyRevenue = await Booking.findAll({
      where: {
        status: 'completed',
        createdAt: { [Op.gte]: startDate }
      },
      attributes: [
        [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
        [require('sequelize').fn('SUM', require('sequelize').col('total_price')), 'revenue'],
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'bookings']
      ],
      group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
      raw: true,
      order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
    });

    res.json(dailyRevenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProviderStats = async (req, res) => {
  try {
    const topProviders = await Property.findAll({
      attributes: [
        'provider_id',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'property_count']
      ],
      group: ['provider_id'],
      include: {
        association: 'provider',
        attributes: ['name', 'email']
      },
      raw: true,
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
      limit: 10
    });

    res.json(topProviders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
