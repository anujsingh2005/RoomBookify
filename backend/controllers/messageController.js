const { Message, User, Booking, Property, Room } = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, booking_id, message, message_type } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !message) {
      return res.status(400).json({ error: 'receiver_id and message are required' });
    }

    const msg = await Message.create({
      sender_id,
      receiver_id,
      booking_id: booking_id || null,
      message,
      message_type: message_type || 'text'
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: msg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { user_id } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: currentUserId, receiver_id: user_id },
          { sender_id: user_id, receiver_id: currentUserId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'googleProfilePicture'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'googleProfilePicture'] },
        { model: Booking, as: 'booking', attributes: ['id', 'check_in', 'check_out'] }
      ],
      order: [['createdAt', 'ASC']],
      limit: 50
    });

    // Mark messages as read
    await Message.update(
      { is_read: true },
      {
        where: {
          receiver_id: currentUserId,
          sender_id: user_id,
          is_read: false
        }
      }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const conversations = await Message.findAll({
      attributes: ['sender_id', 'receiver_id', 'message', 'createdAt', 'is_read'],
      where: {
        [Op.or]: [
          { sender_id: currentUserId },
          { receiver_id: currentUserId }
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      subQuery: false
    });

    // Group by conversation partner
    const conversationMap = {};
    conversations.forEach(msg => {
      const partnerId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      if (!conversationMap[partnerId]) {
        conversationMap[partnerId] = msg;
      }
    });

    // Get user details for each conversation
    const partnerIds = Object.keys(conversationMap);
    const partners = await User.findAll({
      where: { id: partnerIds },
      attributes: ['id', 'name', 'email', 'googleProfilePicture', 'role']
    });

    const result = partners.map(partner => ({
      ...conversationMap[partner.id],
      partner
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const unreadCount = await Message.count({
      where: {
        receiver_id: currentUserId,
        is_read: false
      }
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { message_id } = req.params;

    await Message.update(
      { is_read: true },
      { where: { id: message_id } }
    );

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendCheckInInfo = async (req, res) => {
  try {
    const { booking_id, receiver_id } = req.body;
    const sender_id = req.user.id;

    const booking = await Booking.findByPk(booking_id, {
      include: [
        { model: Room, include: [{ model: Property }] }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const checkInMessage = `
      Check-in Information:
      Property: ${booking.room.property.name}
      Address: ${booking.room.property.address}
      Check-in Time: 3:00 PM
      Check-out Time: 11:00 AM

      WiFi Password: [Your WiFi Password]
      Parking: [Parking Instructions]
      Emergency Contact: [Contact Number]

      House Rules: Please maintain silence after 10 PM. No smoking inside the property.

      Welcome to your stay!
    `;

    const msg = await Message.create({
      sender_id,
      receiver_id,
      booking_id,
      message: checkInMessage,
      message_type: 'check_in_info'
    });

    res.status(201).json({
      message: 'Check-in info sent',
      data: msg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
