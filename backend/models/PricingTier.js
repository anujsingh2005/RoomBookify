const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PricingTier = sequelize.define('PricingTier', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'rooms', key: 'id' }
  },
  nights_min: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nights_max: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  discount_percentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'pricing_tiers',
  timestamps: true
});

module.exports = PricingTier;
