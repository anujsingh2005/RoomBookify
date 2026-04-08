const sequelize = require('../config/database');
const User = require('./User');
const Property = require('./Property');
const Room = require('./Room');
const Booking = require('./Booking');
const Message = require('./Message');
const LoyaltyPoint = require('./LoyaltyPoint');
const Referral = require('./Referral');
const Review = require('./Review');
const PropertyAnalytics = require('./PropertyAnalytics');
const PricingTier = require('./PricingTier');
const SustainabilityCertification = require('./SustainabilityCertification');
const PricingStrategy = require('./PricingStrategy');

// User Associations
User.hasMany(Property, { foreignKey: 'provider_id', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' });

User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

User.hasOne(LoyaltyPoint, { foreignKey: 'user_id' });
LoyaltyPoint.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Referral, { foreignKey: 'referrer_id', as: 'referredUsers' });
User.hasMany(Referral, { foreignKey: 'referred_id', as: 'referrerInfo' });

User.hasMany(Review, { foreignKey: 'guest_id', as: 'writtenReviews' });
Review.belongsTo(User, { foreignKey: 'guest_id', as: 'guest' });

// Property Associations
Property.hasMany(Room, { foreignKey: 'property_id', as: 'rooms' });
Room.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

Room.hasMany(PricingTier, { foreignKey: 'room_id', as: 'pricing_tiers' });
PricingTier.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

Property.hasMany(Review, { foreignKey: 'property_id', as: 'reviews' });
Review.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

Property.hasOne(PropertyAnalytics, { foreignKey: 'property_id' });
PropertyAnalytics.belongsTo(Property, { foreignKey: 'property_id' });

Property.hasOne(SustainabilityCertification, { foreignKey: 'property_id', as: 'sustainability' });
SustainabilityCertification.belongsTo(Property, { foreignKey: 'property_id' });

Property.hasOne(PricingStrategy, { foreignKey: 'property_id', as: 'pricing_strategy' });
PricingStrategy.belongsTo(Property, { foreignKey: 'property_id' });

// Booking Associations
Room.hasMany(Booking, { foreignKey: 'room_id', as: 'bookings' });
Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

Booking.hasMany(Message, { foreignKey: 'booking_id', as: 'messages' });
Message.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

Booking.hasOne(Review, { foreignKey: 'booking_id', as: 'review' });
Review.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

module.exports = {
  sequelize,
  User,
  Property,
  Room,
  Booking,
  Message,
  LoyaltyPoint,
  Referral,
  Review,
  PropertyAnalytics,
  PricingTier,
  SustainabilityCertification,
  PricingStrategy
};
