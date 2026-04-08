const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'properties',
      key: 'id'
    }
  },
  room_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g., Single, Double, Dormitory, Suite'
  },
  total_beds: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  available_beds: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price_per_night: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
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
  tableName: 'rooms',
  timestamps: true
});

module.exports = Room;
