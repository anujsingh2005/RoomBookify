const { LoyaltyPoint } = require('../models');

exports.getUserLoyalty = async (req, res) => {
  try {
    const loyalty = await LoyaltyPoint.findOne({ where: { user_id: req.user.id } });
    if (!loyalty) {
      return res.status(404).json({ error: 'Loyalty record not found' });
    }
    res.json(loyalty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPoints = async (req, res) => {
  try {
    const { user_id, points } = req.body;
    const pointsToAdd = Math.round(points);

    let loyalty = await LoyaltyPoint.findOne({ where: { user_id } });
    if (!loyalty) {
      loyalty = await LoyaltyPoint.create({
        user_id,
        points: pointsToAdd,
        total_earned: pointsToAdd
      });
    } else {
      loyalty.points += pointsToAdd;
      loyalty.total_earned += pointsToAdd;

      // Update tier
      if (loyalty.total_earned >= 50000) loyalty.tier = 'platinum';
      else if (loyalty.total_earned >= 25000) loyalty.tier = 'gold';
      else if (loyalty.total_earned >= 10000) loyalty.tier = 'silver';
      else loyalty.tier = 'bronze';

      await loyalty.save();
    }
    res.json(loyalty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.redeemPoints = async (req, res) => {
  try {
    const { points } = req.body;
    const loyalty = await LoyaltyPoint.findOne({ where: { user_id: req.user.id } });

    if (!loyalty || loyalty.points < points) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    loyalty.points -= points;
    loyalty.total_redeemed += points;
    await loyalty.save();

    // Create discount coupon (value: points / 100)
    const discountAmount = Math.floor(points / 100);

    res.json({
      message: 'Points redeemed successfully',
      discount: discountAmount,
      coupon_code: `LOYALTY${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
