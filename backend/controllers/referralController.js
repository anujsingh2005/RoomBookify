const { Referral, LoyaltyPoint } = require('../models');
const { Sequelize } = require('sequelize');

exports.generateReferralCode = async (req, res) => {
  try {
    const referralCode = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const referral = await Referral.create({
      referrer_id: req.user.id,
      referral_code: referralCode,
      status: 'pending'
    });

    res.json({
      message: 'Referral code generated',
      referral_code: referralCode,
      share_link: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/register?ref=${referralCode}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.applyReferralCode = async (req, res) => {
  try {
    const { referral_code } = req.body;

    const referral = await Referral.findOne({ where: { referral_code } });
    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    referral.referred_id = req.user.id;
    referral.status = 'completed';
    referral.completed_at = new Date();
    await referral.save();

    // Add points to referrer
    let referrerLoyalty = await LoyaltyPoint.findOne({ where: { user_id: referral.referrer_id } });
    if (referrerLoyalty) {
      referrerLoyalty.points += referral.reward_points;
      referrerLoyalty.total_earned += referral.reward_points;

      // Update tier
      if (referrerLoyalty.total_earned >= 50000) referrerLoyalty.tier = 'platinum';
      else if (referrerLoyalty.total_earned >= 25000) referrerLoyalty.tier = 'gold';
      else if (referrerLoyalty.total_earned >= 10000) referrerLoyalty.tier = 'silver';

      await referrerLoyalty.save();
    }

    // Create loyalty points for referred user
    let referredLoyalty = await LoyaltyPoint.findOne({ where: { user_id: req.user.id } });
    if (!referredLoyalty) {
      referredLoyalty = await LoyaltyPoint.create({
        user_id: req.user.id,
        points: 250,
        total_earned: 250,
        tier: 'bronze'
      });
    } else {
      referredLoyalty.points += 250;
      referredLoyalty.total_earned += 250;
      await referredLoyalty.save();
    }

    res.json({
      message: 'Referral code applied successfully',
      bonus_points: 250
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReferralStats = async (req, res) => {
  try {
    const referrals = await Referral.findAll({ where: { referrer_id: req.user.id } });
    const completedReferrals = referrals.filter(r => r.status === 'completed').length;
    const totalEarnings = completedReferrals * 500;

    res.json({
      total_referrals: referrals.length,
      completed_referrals: completedReferrals,
      total_earnings: totalEarnings,
      referrals
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
