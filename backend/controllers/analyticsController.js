const { Property, Booking, Room, PricingStrategy, PropertyAnalytics, sequelize } = require('../models');
const { Op } = require('sequelize');

// Helper: Calculate dynamic price based on factors
const calculateDynamicPrice = (basePrice, occupancyRate, demand, dayOfWeek, season) => {
  let multiplier = 1.0;

  // Demand-based pricing
  if (occupancyRate > 80) multiplier *= 1.2;
  else if (occupancyRate < 40) multiplier *= 0.9;

  // Season multiplier
  if (season === 'peak') multiplier *= 1.15;
  else if (season === 'low') multiplier *= 0.85;

  // Weekend boost
  if ([5, 6].includes(dayOfWeek)) multiplier *= 1.1;

  // Demand level
  if (demand === 'very_high') multiplier *= 1.2;
  else if (demand === 'high') multiplier *= 1.1;
  else if (demand === 'low') multiplier *= 0.9;

  return Math.round(basePrice * multiplier);
};

exports.getPropertyAnalytics = async (req, res) => {
  try {
    const { property_id } = req.params;

    // Verify ownership
    const property = await Property.findByPk(property_id);
    if (!property || property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get bookings for this property (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const bookings = await Booking.findAll({
      include: {
        association: 'room',
        where: { property_id },
        attributes: ['id', 'price_per_night']
      },
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo },
        status: 'confirmed'
      }
    });

    const cancelledBookings = await Booking.findAll({
      include: {
        association: 'room',
        where: { property_id },
        attributes: ['id']
      },
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo },
        status: 'cancelled'
      }
    });

    // Calculate metrics
    const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0);
    const totalBookings = bookings.length;
    const totalCancelledBookings = cancelledBookings.length;
    const cancellationRate = totalBookings > 0 ? ((totalCancelledBookings / (totalBookings + totalCancelledBookings)) * 100).toFixed(2) : 0;

    // Average price
    const avgPrice = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

    // Get room count
    const rooms = await Room.findAll({ where: { property_id } });
    const totalBeds = rooms.reduce((sum, r) => sum + r.total_beds, 0);
    const bookedBeds = bookings.reduce((sum, b) => sum + b.beds_booked, 0);

    // Occupancy rate (booked nights / available nights)
    const totalAvailableNights = totalBeds * 30;
    const occupancyRate = totalAvailableNights > 0 ? ((bookedBeds / totalAvailableNights) * 100).toFixed(2) : 0;

    res.json({
      property_id,
      period: '30_days',
      revenue: {
        total: totalRevenue,
        average_per_booking: avgPrice
      },
      bookings: {
        total_confirmed: totalBookings,
        total_cancelled: totalCancelledBookings,
        cancellation_rate: parseFloat(cancellationRate)
      },
      occupancy: {
        rate_percent: parseFloat(occupancyRate),
        beds_booked: bookedBeds,
        beds_available: totalBeds
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenuetrend = async (req, res) => {
  try {
    const { property_id, days = 30 } = req.query;

    // Verify ownership
    const property = await Property.findByPk(property_id);
    if (!property || property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    // Get daily revenue
    const bookings = await Booking.findAll({
      include: {
        association: 'room',
        where: { property_id },
        attributes: []
      },
      where: {
        createdAt: { [Op.gte]: startDate },
        status: 'confirmed'
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'daily_revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookings']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      raw: true,
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    const trend = bookings.map(b => ({
      date: b.date,
      revenue: parseFloat(b.daily_revenue) || 0,
      bookings: parseInt(b.bookings) || 0
    }));

    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPricingRecommendation = async (req, res) => {
  try {
    const { property_id } = req.params;

    // Verify ownership
    const property = await Property.findByPk(property_id, {
      include: { association: 'pricing_strategy', attributes: ['base_price'] }
    });

    if (!property || property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get recent bookings to assess demand
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentBookings = await Booking.findAll({
      include: {
        association: 'room',
        where: { property_id },
        attributes: []
      },
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo },
        status: 'confirmed'
      }
    });

    const basePrice = property.pricing_strategy?.base_price || 5000;
    const occupancyRate = (recentBookings.length / 30) * 100;
    const demand = occupancyRate > 80 ? 'very_high' : occupancyRate > 60 ? 'high' : 'low';

    const currentDate = new Date();
    const season = currentDate.getMonth() >= 10 || currentDate.getMonth() <= 2 ? 'peak' : 'low';

    const recommendations = [];

    if (occupancyRate > 75) {
      recommendations.push({
        type: 'price_increase',
        suggestion: 'Increase price by 10-15%',
        reason: 'High occupancy rate indicates strong demand',
        estimated_new_price: Math.round(basePrice * 1.12)
      });
    } else if (occupancyRate < 40) {
      recommendations.push({
        type: 'price_decrease',
        suggestion: 'Decrease price by 10-15%',
        reason: 'Low occupancy rate - reduce price to attract more bookings',
        estimated_new_price: Math.round(basePrice * 0.88)
      });
    }

    if (demand === 'very_high') {
      recommendations.push({
        type: 'dynamic_pricing',
        suggestion: 'Enable dynamic pricing seasonal strategy',
        reason: 'Very high demand detected - use seasonal multipliers',
        peak_multiplier: 1.2,
        low_multiplier: 0.9
      });
    }

    recommendations.push({
      type: 'occupancy_target',
      current_occupancy: occupancyRate.toFixed(2),
      target_occupancy: 80,
      suggestion: occupancyRate < 80 ? 'Run promotional campaigns' : 'Maintain current pricing strategy'
    });

    res.json({
      property_id,
      base_price: basePrice,
      current_occupancy: occupancyRate.toFixed(2),
      demand_level: demand,
      season,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePricingStrategy = async (req, res) => {
  try {
    const { property_id } = req.params;
    const { strategy_type, base_price, peak_season_multiplier, low_season_multiplier, weekend_multiplier, minimum_price, maximum_price, auto_adjust } = req.body;

    // Verify ownership
    const property = await Property.findByPk(property_id);
    if (!property || property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let strategy = await PricingStrategy.findOne({ where: { property_id } });

    if (!strategy) {
      strategy = await PricingStrategy.create({
        property_id,
        base_price: base_price || 5000,
        strategy_type: strategy_type || 'manual'
      });
    }

    if (strategy_type) strategy.strategy_type = strategy_type;
    if (base_price) strategy.base_price = base_price;
    if (peak_season_multiplier) strategy.peak_season_multiplier = peak_season_multiplier;
    if (low_season_multiplier) strategy.low_season_multiplier = low_season_multiplier;
    if (weekend_multiplier) strategy.weekend_multiplier = weekend_multiplier;
    if (minimum_price) strategy.minimum_price = minimum_price;
    if (maximum_price) strategy.maximum_price = maximum_price;
    if (auto_adjust !== undefined) strategy.auto_adjust = auto_adjust;

    await strategy.save();

    res.json({
      message: 'Pricing strategy updated successfully',
      strategy
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPricingStrategy = async (req, res) => {
  try {
    const { property_id } = req.params;

    const strategy = await PricingStrategy.findOne({ where: { property_id } });

    if (!strategy) {
      return res.status(404).json({ error: 'Pricing strategy not found' });
    }

    // Verify ownership if user is logged in
    if (req.user) {
      const property = await Property.findByPk(property_id);
      if (property.provider_id !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    res.json(strategy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
