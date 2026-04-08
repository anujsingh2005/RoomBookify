const { User, Property, Room, Booking, Review, LoyaltyPoint, Referral } = require('../models');
const bcrypt = require('bcryptjs');

const formatDateOffset = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const upsertUser = async (email, defaults) => {
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults
  });

  if (!created) {
    await user.update(defaults);
  }

  return user;
};

const upsertProperty = async (name, values) => {
  const [property, created] = await Property.findOrCreate({
    where: { name },
    defaults: values
  });

  if (!created) {
    await property.update(values);
  }

  return property;
};

const upsertRoom = async (where, values) => {
  const [room, created] = await Room.findOrCreate({
    where,
    defaults: values
  });

  if (!created) {
    await room.update(values);
  }

  return room;
};

const upsertBooking = async (where, values) => {
  const [booking, created] = await Booking.findOrCreate({
    where,
    defaults: values
  });

  if (!created) {
    await booking.update(values);
  }

  return booking;
};

const upsertReview = async (bookingId, values) => {
  const [review, created] = await Review.findOrCreate({
    where: { booking_id: bookingId },
    defaults: values
  });

  if (!created) {
    await review.update(values);
  }

  return review;
};

exports.seedData = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const demoSeeker = await upsertUser('demo@example.com', {
      name: 'Demo Seeker',
      password_hash: hashedPassword,
      role: 'seeker'
    });

    const demoProvider = await upsertUser('provider@example.com', {
      name: 'Demo Provider',
      password_hash: hashedPassword,
      role: 'provider',
      udyam_status: 'not_registered'
    });

    await upsertUser('admin@example.com', {
      name: 'Admin User',
      password_hash: hashedPassword,
      role: 'admin'
    });

    const property1 = await upsertProperty('Ocean View Luxury Hotel', {
      provider_id: demoProvider.id,
      name: 'Ocean View Luxury Hotel',
      type: 'hotel',
      address: '123 Marine Drive, Mumbai, Maharashtra 400020',
      base_price: 3500,
      amenities: ['WiFi', 'meals_included', 'room_service', 'gym', 'swimming_pool', 'spa', 'AC'],
      description: 'Experience luxury and comfort at our beachfront hotel with stunning ocean views.',
      image_url: 'https://via.placeholder.com/600x400?text=Luxury+Hotel',
      latitude: 19.078,
      longitude: 72.8798,
      commute_landmark: 'Nariman Point offices',
      commute_minutes: 14,
      preferred_for: 'working_professional',
      move_in_assurance: true,
      assurance_notes: 'Verified photos, hosted move-in walkthrough, and relocation help in the first 48 hours.'
    });

    const property2 = await upsertProperty('The Grand PG Residences', {
      provider_id: demoProvider.id,
      name: 'The Grand PG Residences',
      type: 'pg',
      address: '456 Tech Park, Bangalore, Karnataka 560001',
      base_price: 1500,
      amenities: ['WiFi', 'meals_included', 'laundry', 'AC'],
      description: 'Affordable and comfortable PG accommodation for professionals and students.',
      image_url: 'https://via.placeholder.com/600x400?text=PG+Residences',
      latitude: 12.9759,
      longitude: 77.6069,
      commute_landmark: 'Manyata Tech Park',
      commute_minutes: 18,
      preferred_for: 'student',
      move_in_assurance: true,
      assurance_notes: 'Deposit-support desk and room swap support if the allocated bed does not match the listing.'
    });

    const property3 = await upsertProperty('Backpacker Hub Hostel', {
      provider_id: demoProvider.id,
      name: 'Backpacker Hub Hostel',
      type: 'hostel',
      address: '789 Main Street, Delhi, Delhi 110001',
      base_price: 800,
      amenities: ['WiFi', 'common_kitchen', 'laundry'],
      description: 'Budget-friendly hostel perfect for backpackers and solo travelers.',
      image_url: 'https://via.placeholder.com/600x400?text=Backpacker+Hostel',
      latitude: 28.6329,
      longitude: 77.2195,
      commute_landmark: 'Connaught Place metro',
      commute_minutes: 9,
      preferred_for: 'traveler',
      move_in_assurance: false,
      assurance_notes: null
    });

    const property4 = await upsertProperty('Skyline Family Flat', {
      provider_id: demoProvider.id,
      name: 'Skyline Family Flat',
      type: 'flat',
      address: '34 Sector 62, Noida, Uttar Pradesh 201309',
      base_price: 2600,
      amenities: ['WiFi', 'laundry', 'AC'],
      description: 'Spacious serviced flat for families and long stays close to the business district.',
      image_url: 'https://via.placeholder.com/600x400?text=Family+Flat',
      latitude: 28.6281,
      longitude: 77.3649,
      commute_landmark: 'Sector 62 business district',
      commute_minutes: 7,
      preferred_for: 'family',
      move_in_assurance: true,
      assurance_notes: 'Verified inventory checklist, host KYC, and same-day support if essentials are missing.'
    });

    await upsertRoom(
      { property_id: property1.id, room_type: 'Standard Room' },
      {
        property_id: property1.id,
        room_type: 'Standard Room',
        total_beds: 1,
        available_beds: 5,
        price_per_night: 3500
      }
    );

    const property1Deluxe = await upsertRoom(
      { property_id: property1.id, room_type: 'Deluxe Room' },
      {
        property_id: property1.id,
        room_type: 'Deluxe Room',
        total_beds: 2,
        available_beds: 3,
        price_per_night: 5000
      }
    );

    await upsertRoom(
      { property_id: property1.id, room_type: 'Suite' },
      {
        property_id: property1.id,
        room_type: 'Suite',
        total_beds: 3,
        available_beds: 2,
        price_per_night: 7500
      }
    );

    const property2Single = await upsertRoom(
      { property_id: property2.id, room_type: 'Single Room' },
      {
        property_id: property2.id,
        room_type: 'Single Room',
        total_beds: 1,
        available_beds: 4,
        price_per_night: 1500
      }
    );

    await upsertRoom(
      { property_id: property2.id, room_type: 'Double Room' },
      {
        property_id: property2.id,
        room_type: 'Double Room',
        total_beds: 2,
        available_beds: 2,
        price_per_night: 2500
      }
    );

    const property3Dorm = await upsertRoom(
      { property_id: property3.id, room_type: 'Dormitory' },
      {
        property_id: property3.id,
        room_type: 'Dormitory',
        total_beds: 6,
        available_beds: 12,
        price_per_night: 800
      }
    );

    const property4Flat = await upsertRoom(
      { property_id: property4.id, room_type: 'Entire Flat' },
      {
        property_id: property4.id,
        room_type: 'Entire Flat',
        total_beds: 3,
        available_beds: 1,
        price_per_night: 2600
      }
    );

    const completedBooking1 = await upsertBooking(
      {
        user_id: demoSeeker.id,
        room_id: property1Deluxe.id,
        check_in: formatDateOffset(-22),
        check_out: formatDateOffset(-19)
      },
      {
        user_id: demoSeeker.id,
        room_id: property1Deluxe.id,
        beds_booked: 1,
        check_in: formatDateOffset(-22),
        check_out: formatDateOffset(-19),
        total_price: 15000,
        status: 'checked_out'
      }
    );

    const completedBooking2 = await upsertBooking(
      {
        user_id: demoSeeker.id,
        room_id: property2Single.id,
        check_in: formatDateOffset(-16),
        check_out: formatDateOffset(-11)
      },
      {
        user_id: demoSeeker.id,
        room_id: property2Single.id,
        beds_booked: 1,
        check_in: formatDateOffset(-16),
        check_out: formatDateOffset(-11),
        total_price: 7500,
        status: 'checked_out'
      }
    );

    const completedBooking3 = await upsertBooking(
      {
        user_id: demoSeeker.id,
        room_id: property4Flat.id,
        check_in: formatDateOffset(-10),
        check_out: formatDateOffset(-6)
      },
      {
        user_id: demoSeeker.id,
        room_id: property4Flat.id,
        beds_booked: 1,
        check_in: formatDateOffset(-10),
        check_out: formatDateOffset(-6),
        total_price: 10400,
        status: 'checked_out'
      }
    );

    await upsertBooking(
      {
        user_id: demoSeeker.id,
        room_id: property3Dorm.id,
        check_in: formatDateOffset(5),
        check_out: formatDateOffset(9)
      },
      {
        user_id: demoSeeker.id,
        room_id: property3Dorm.id,
        beds_booked: 1,
        check_in: formatDateOffset(5),
        check_out: formatDateOffset(9),
        total_price: 3200,
        status: 'confirmed'
      }
    );

    await upsertReview(completedBooking1.id, {
      property_id: property1.id,
      guest_id: demoSeeker.id,
      booking_id: completedBooking1.id,
      rating: 5,
      title: 'Smooth business stay',
      comment: 'Fast Wi-Fi, quiet rooms, and the commute to Nariman Point was genuinely easy every morning.',
      cleanliness: 5,
      wifi_rating: 5,
      food_rating: 4,
      safety_rating: 5,
      rule_flexibility_rating: 4,
      communication: 5,
      location: 5,
      value: 4,
      createdAt: new Date()
    });

    await upsertReview(completedBooking2.id, {
      property_id: property2.id,
      guest_id: demoSeeker.id,
      booking_id: completedBooking2.id,
      rating: 4,
      title: 'Great student PG',
      comment: 'Meals and Wi-Fi were consistent, and the manager was fair about gate timings during exam week.',
      cleanliness: 4,
      wifi_rating: 4,
      food_rating: 4,
      safety_rating: 5,
      rule_flexibility_rating: 4,
      communication: 4,
      location: 4,
      value: 5,
      createdAt: new Date()
    });

    await upsertReview(completedBooking3.id, {
      property_id: property4.id,
      guest_id: demoSeeker.id,
      booking_id: completedBooking3.id,
      rating: 5,
      title: 'Reliable long-stay flat',
      comment: 'Everything matched the listing, the handover was professional, and the support team handled a missing kettle the same day.',
      cleanliness: 5,
      wifi_rating: 4,
      food_rating: 3,
      safety_rating: 5,
      rule_flexibility_rating: 5,
      communication: 5,
      location: 4,
      value: 4,
      createdAt: new Date()
    });

    const [loyalty, loyaltyCreated] = await LoyaltyPoint.findOrCreate({
      where: { user_id: demoSeeker.id },
      defaults: {
        user_id: demoSeeker.id,
        points: 5000,
        total_earned: 15000,
        tier: 'silver'
      }
    });

    if (!loyaltyCreated) {
      await loyalty.update({
        points: 5000,
        total_earned: 15000,
        tier: 'silver'
      });
    }

    const [referral, referralCreated] = await Referral.findOrCreate({
      where: { referrer_id: demoProvider.id, referred_id: demoSeeker.id },
      defaults: {
        referrer_id: demoProvider.id,
        referred_id: demoSeeker.id,
        referral_code: `REF${demoProvider.id}`,
        status: 'completed'
      }
    });

    if (!referralCreated) {
      await referral.update({
        referral_code: `REF${demoProvider.id}`,
        status: 'completed'
      });
    }

    res.json({
      message: 'Demo data seeded or refreshed successfully',
      demoAccounts: {
        seeker: { email: 'demo@example.com', password: 'demo123' },
        provider: { email: 'provider@example.com', password: 'demo123' },
        admin: { email: 'admin@example.com', password: 'demo123' }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
