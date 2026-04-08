const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PricingStrategy = sequelize.define('PricingStrategy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  property_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
    references: { model: 'properties', key: 'id' }
  },
  strategy_type: {
    type: DataTypes.ENUM('manual', 'dynamic', 'seasonal'),
    defaultValue: 'manual'
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  peak_season_multiplier: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  low_season_multiplier: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  weekend_multiplier: {
    type: DataTypes.FLOAT,
    defaultValue: 1.1
  },
  minimum_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  maximum_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  auto_adjust: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'pricing_strategies',
  timestamps: true
});

module.exports = PricingStrategy;
