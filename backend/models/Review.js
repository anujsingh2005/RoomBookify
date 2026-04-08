const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'properties', key: 'id' }
  },
  guest_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'bookings', key: 'id' }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  cleanliness: { type: DataTypes.INTEGER },
  wifi_rating: { type: DataTypes.INTEGER },
  food_rating: { type: DataTypes.INTEGER },
  safety_rating: { type: DataTypes.INTEGER },
  rule_flexibility_rating: { type: DataTypes.INTEGER },
  communication: { type: DataTypes.INTEGER },
  location: { type: DataTypes.INTEGER },
  value: { type: DataTypes.INTEGER },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reviews',
  timestamps: false
});

module.exports = Review;
