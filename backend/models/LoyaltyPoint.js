const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LoyaltyPoint = sequelize.define('LoyaltyPoint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_earned: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_redeemed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tier: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'loyalty_points',
  timestamps: true
});

module.exports = LoyaltyPoint;
