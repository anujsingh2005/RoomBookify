const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PropertyAnalytics = sequelize.define('PropertyAnalytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: 'properties', key: 'id' }
  },
  total_bookings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_revenue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  occupancy_rate: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  average_rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  competitor_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avg_competitor_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  demand_level: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'very_high'),
    defaultValue: 'medium'
  },
  suggested_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'property_analytics',
  timestamps: false
});

module.exports = PropertyAnalytics;
