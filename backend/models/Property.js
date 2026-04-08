const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  provider_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('hotel', 'hostel', 'pg', 'room', 'flat'),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of amenities like WiFi, meals_included, room_service, etc.'
  },
  description: {
    type: DataTypes.TEXT
  },
  image_url: {
    type: DataTypes.STRING(500)
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true
  },
  commute_landmark: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  commute_minutes: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  preferred_for: {
    type: DataTypes.ENUM('student', 'working_professional', 'intern', 'family', 'traveler'),
    allowNull: true
  },
  move_in_assurance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  assurance_notes: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'properties',
  timestamps: true
});

module.exports = Property;
