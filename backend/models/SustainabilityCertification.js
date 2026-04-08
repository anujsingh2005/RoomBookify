const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SustainabilityCertification = sequelize.define('SustainabilityCertification', {
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
  certification_level: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum'),
    defaultValue: 'bronze'
  },
  solar_panels: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rainwater_harvesting: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  waste_management: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  energy_efficient: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sustainable_materials: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  local_employment: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  carbon_neutral: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  community_programs: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verification_status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'sustainability_certifications',
  timestamps: true
});

module.exports = SustainabilityCertification;
