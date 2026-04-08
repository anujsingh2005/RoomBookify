const { PricingTier, Room, Property } = require('../models');

exports.getPricingTiers = async (req, res) => {
  try {
    const { room_id } = req.params;

    const room = await Room.findByPk(room_id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const tiers = await PricingTier.findAll({ where: { room_id } });
    res.json(tiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPricingTier = async (req, res) => {
  try {
    const { room_id, nights_min, nights_max, discount_percentage, description } = req.body;

    // Verify room ownership
    const room = await Room.findByPk(room_id, {
      include: { association: 'property', attributes: ['provider_id'] }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validate tier range
    if (nights_min >= nights_max) {
      return res.status(400).json({ error: 'nights_min must be less than nights_max' });
    }

    if (discount_percentage < 0 || discount_percentage > 100) {
      return res.status(400).json({ error: 'discount_percentage must be between 0 and 100' });
    }

    const tier = await PricingTier.create({
      room_id,
      nights_min,
      nights_max,
      discount_percentage,
      description
    });

    res.status(201).json({
      message: 'Pricing tier created successfully',
      tier
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePricingTier = async (req, res) => {
  try {
    const { tier_id } = req.params;
    const { nights_min, nights_max, discount_percentage, description } = req.body;

    const tier = await PricingTier.findByPk(tier_id, {
      include: {
        association: 'room',
        include: { association: 'property', attributes: ['provider_id'] }
      }
    });

    if (!tier) {
      return res.status(404).json({ error: 'Pricing tier not found' });
    }

    if (tier.room.property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (nights_min && nights_max && nights_min >= nights_max) {
      return res.status(400).json({ error: 'nights_min must be less than nights_max' });
    }

    if (discount_percentage && (discount_percentage < 0 || discount_percentage > 100)) {
      return res.status(400).json({ error: 'discount_percentage must be between 0 and 100' });
    }

    await tier.update({
      nights_min: nights_min || tier.nights_min,
      nights_max: nights_max || tier.nights_max,
      discount_percentage: discount_percentage !== undefined ? discount_percentage : tier.discount_percentage,
      description: description || tier.description
    });

    res.json({
      message: 'Pricing tier updated successfully',
      tier
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePricingTier = async (req, res) => {
  try {
    const { tier_id } = req.params;

    const tier = await PricingTier.findByPk(tier_id, {
      include: {
        association: 'room',
        include: { association: 'property', attributes: ['provider_id'] }
      }
    });

    if (!tier) {
      return res.status(404).json({ error: 'Pricing tier not found' });
    }

    if (tier.room.property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await tier.destroy();

    res.json({ message: 'Pricing tier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.initializeDefaultTiers = async (req, res) => {
  try {
    const { room_id } = req.body;

    // Verify room ownership
    const room = await Room.findByPk(room_id, {
      include: { association: 'property', attributes: ['provider_id'] }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.property.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete existing tiers
    await PricingTier.destroy({ where: { room_id } });

    // Create default tiers
    const defaultTiers = [
      { room_id, nights_min: 1, nights_max: 6, discount_percentage: 0, description: 'Standard rate' },
      { room_id, nights_min: 7, nights_max: 29, discount_percentage: 10, description: '7-29 nights: 10% off' },
      { room_id, nights_min: 30, nights_max: 89, discount_percentage: 20, description: '30-89 nights: 20% off' },
      { room_id, nights_min: 90, nights_max: 9999, discount_percentage: 35, description: '90+ nights: 35% off' }
    ];

    const tiers = await PricingTier.bulkCreate(defaultTiers);

    res.json({
      message: 'Default pricing tiers initialized successfully',
      tiers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
